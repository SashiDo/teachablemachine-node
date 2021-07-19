global.fetch = require("node-fetch");

const { Readable } = require('stream');
const tf = require('@tensorflow/tfjs-node');
const isImageUrl = require('is-image-url');
const parseDataUrl = require('parse-data-url');

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

const bufferToStream = (binary) => {
  const readableInstanceStream = new Readable({
    read() {
      this.push(binary);
      this.push(null);
    }
  });

  return readableInstanceStream;
}

const predict = async (imgTensor, model) => {
  const logits = tf.tidy(() => {
    let img = tf.image.resizeNearestNeighbor(imgTensor, [model.inputs[0].shape[1], model.inputs[0].shape[2]]);

    const offset = tf.scalar(127.5);
    // Normalize the image from [0, 255] to [-1, 1].
    const normalized = img.sub(offset).div(offset);

    // Reshape to a single-element batch so we can pass it to predict.
    const batched = normalized.reshape([1, model.inputs[0].shape[1], model.inputs[0].shape[2], model.inputs[0].shape[3]]);

    return model.predict(batched);
  });

  const predictions = await getTopKClasses(logits, model.classes);

  return predictions;
}

const getTopKClasses = async (logits, classes) => {
  const values = await logits.data();
  const topK = Math.min(classes.length, values.length);

  const valuesAndIndices = [];
  for (let i = 0; i < values.length; i++) {
    valuesAndIndices.push({ value: values[i], index: i });
  }

  valuesAndIndices.sort((a, b) => {
    return b.value - a.value;
  });

  const topkValues = new Float32Array(topK);
  const topkIndices = new Int32Array(topK);
  for (let i = 0; i < topK; i++) {
    topkValues[i] = valuesAndIndices[i].value;
    topkIndices[i] = valuesAndIndices[i].index;
  }

  const topClassesAndProbs = [];
  for (let i = 0; i < topkIndices.length; i++) {
    topClassesAndProbs.push({
      class: classes[topkIndices[i]],
      score: topkValues[i]
    });
  }
  return topClassesAndProbs;
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
      const modelURL = `${modelUrl}model.json`;
      const response = await fetch(`${modelUrl}metadata.json`);
      const body = await response.text();
      this.model = await tf.loadLayersModel(modelURL);
      this.model.classes = JSON.parse(body).labels;
      // console.log('@@@', this.model)

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

    if ((!imageUrl.startsWith('data:image/')) && (!isImageUrl(imageUrl))) {
      return Promise.reject({ error: "Image URL is not valid!" });
    }

    if (this.error) {
      return Promise.reject({ error: this.error });
    }

    return retryOperation(() => this.checkModel(() => this.inference(params)), 1000, 20); // method, delay, retries
  }

  async inference({ imageUrl }) {
    try {
      let data;
      let buffer;
      let contentType;

      if (imageUrl.startsWith('data:image/')) {
        data = parseDataUrl(imageUrl);

        contentType = data.contentType;
        buffer = data.toBuffer();
      } else {
        data = await fetch(imageUrl);

        contentType = data.headers.get("Content-Type");
        buffer = await data.buffer();
      }

      let imagesTensor3D;

      if ((/png/).test(contentType) || (/jpe?g/).test(contentType)) {
        imagesTensor3D = [tf.node.decodeImage(buffer)];
      }

      if ((/gif/).test(contentType)) {
        // tensor 4d has structure [num_frames, height, width, 3]
        const imageTensor4D = tf.node.decodeGif(buffer)
        imagesTensor3D = tf.unstack(imageTensor4D)
      }

      const predictions = await Promise.all(imagesTensor3D.map(imageTensor3D => predict(imageTensor3D, this.model)));
      // return one prediction if running inference on single image and and array if running on gif
      return predictions.length == 1 ? predictions[0] : predictions
    } catch (error) {
      return Promise.reject({ error });
    }
  }
}

module.exports = SashiDoTeachableMachine;
