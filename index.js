const tmImage = require("@teachablemachine/image");
const canvas = require("canvas");
const { JSDOM } = require("jsdom");
const dom = new JSDOM("");


global.fetch = require("node-fetch");
global.document = dom.window.document;
global.HTMLVideoElement = dom.window.HTMLVideoElement;


function getConfig(params = {}) {
  const { modelUrl } = params;
  if (!modelUrl || modelUrl === "") {
    console.error("Missing config!");
  }

  return params;
}


const wait = ms => new Promise(r => setTimeout(r, ms));


const retryOperation = (operation, delay, times, retriesCounter = 0) => new Promise((resolve, reject) => {
  return operation()
    .then(({ cb }) => {
      return resolve(cb());
    })
    .catch(({ message }) => {
      if (retriesCounter === 0) {
        console.info('@@@@', message);
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
    const config = getConfig(params);
    this.config = config;

    this.loadModel(config);
  }


  async loadModel() {
    const { modelUrl } = this.config;

    try {
      this.model = await tmImage.load(`${modelUrl}model.json`, `${modelUrl}metadata.json`);
    } catch (e) {
      console.error(e);
    }
  }


  async checkModel(params) {
    const { model } = this;

    if (model) {
      return Promise.resolve({ cb: () => this.inference(params) });
    }

    return Promise.reject({ message: `Loading model: ${this.config.modelUrl}` });
  }


  async classify(params) {
    const { imageUrl } = params;
    if (
      (!imageUrl && imageUrl !== "")
    ) {
      console.error("Missing config!");
      return Promise.reject("Missing config!");
    }
    return retryOperation(() => this.checkModel(params, () => this.inference(params)), 1000, 6); // method, delay, retries
  }

  async inference({ imageUrl }) {
    let results = {};

    try {
      const image = new canvas.Image()
      image.src = imageUrl;

      const predictions = await this.model.predict(image);
      results = predictions.sort(byProbabilty);
    } catch (e) {
      console.error(e);
      results.error = err;
      return results;
    }

    return results;
  }
}

module.exports = SashiDoTeachable;
