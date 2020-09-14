const tmImage = require("@teachablemachine/image");
const isImageUrl = require('is-image-url');
const canvas = require("canvas");
const { JSDOM } = require("jsdom");
const dom = new JSDOM("");


global.fetch = require("node-fetch");
global.document = dom.window.document;
global.HTMLVideoElement = dom.window.HTMLVideoElement;


const wait = ms => new Promise(r => setTimeout(r, ms));


const retryOperation = (operation, delay, times, retriesCounter = 0) => new Promise((resolve, reject) => {
  return operation()
    .then(({ cb }) => {
      return resolve(cb());
    })
    .catch(({ message }) => {
      if (retriesCounter === 0) {
        console.info("[@sashido/teachablemachine-node] -", message);
      }

      if (times - 1 > 0) {
        retriesCounter++;
        return wait(delay)
          .then(retryOperation.bind(null, operation, delay, times - 1, retriesCounter))
          .then(resolve)
          .catch(reject);
      }

      return reject(message);
    });
});

const byProbabilty = (predictionA, predictionB) => {
  if (predictionA.probability > predictionB.probability) return -1;
  if (predictionA.probability < predictionB.probability) return 1;
  return 0;
}

class SashiDoTeachable {
  constructor(params) {
    this.loadModel(params);
  }


  async loadModel({ modelUrl }) {
    if (!modelUrl || modelUrl === "") {
      console.error("[@sashido/teachablemachine-node] -", "Missing model URL!");
    }

    try {
      this.model = await tmImage.load(`${modelUrl}model.json`, `${modelUrl}metadata.json`);
    } catch (e) {
      console.error("[@sashido/teachablemachine-node] -", e);
    }
  }


  async classify(params) {
    const { model } = this;
    const { imageUrl } = params;

    if (!isImageUrl(imageUrl)) {
      console.error("[@sashido/teachablemachine-node] -", "Image URL is not valid!");
      return Promise.reject({ error: "Image URL is not valid!" });
    }

    if (!model) {
      console.error("[@sashido/teachablemachine-node] -", "Model is not ready!");
      return Promise.reject({ error: "Model is not ready!" });
    }

    try {
      const image = new canvas.Image();
      image.src = imageUrl;

      const predictions = await this.model.predict(image);
      return predictions.sort(byProbabilty);
    } catch (error) {
      console.error("[@sashido/teachablemachine-node] -", error);
      return Promise.reject({ error });
    }
  }
}

module.exports = SashiDoTeachable;
