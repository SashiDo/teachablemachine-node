global.BigInt = require("bigint-polyfill");
global.fetch = require("node-fetch");

const tmImage = require("@teachablemachine/image");
const isImageUrl = require('is-image-url');
const canvas = require("canvas");

const { JSDOM } = require("jsdom");
const dom = new JSDOM("");
global.document = dom.window.document;
global.HTMLVideoElement = dom.window.HTMLVideoElement;


const wait = ms => new Promise(r => setTimeout(r, ms));

const retryOperation = (operation, delay, times) => new Promise((resolve, reject) => {
  return operation()
    .then(({ cb }) => {
      return resolve(cb());
    })
    .catch(({ message }) => {
      if (times - 1 > 0) {
        return wait(delay)
          .then(retryOperation.bind(null, operation, delay, times - 1))
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


class SashiDoTeachableMachine {
  constructor(params) {
    this.loadModel(params);
  }

  async loadModel({ modelUrl }) {
    if (!modelUrl || modelUrl === "") {
      console.error("[@sashido/teachablemachine-node] -", "Missing model URL!");
      this.error = "Missing model URL!";
      return null;
    }

    try {
      this.model = await tmImage.load(`${modelUrl}model.json`, `${modelUrl}metadata.json`);
    } catch (e) {
      console.error("[@sashido/teachablemachine-node] -", e);
    }
  }

  async checkModel(cb) {
    const { model } = this;

    if (model) {
      return Promise.resolve({ cb });
    }

    return Promise.reject({ message: "Loading model" });
  }


  async classify(params) {
    const { imageUrl } = params;

    if (!isImageUrl(imageUrl)) {
      return Promise.reject({ error: "Image URL is not valid!" });
    }

    if (this.error) {
      return Promise.reject({ error: this.error });
    }

    return retryOperation(() => this.checkModel(() => this.inference(params)), 1000, 20); // method, delay, retries
  }

  async inference({ imageUrl }) {
    try {
      const image = new canvas.Image();
      image.src = imageUrl;

      const predictions = await this.model.predict(image);
      return predictions.sort(byProbabilty);
    } catch (error) {
      return Promise.reject({ error });
    }
  }
}

module.exports = SashiDoTeachableMachine;
