# SashiDo Teachable Machine v1.0.0

The package empowers you to deploy any image classification model trained with Teachable Machine in a [SashiDo](https://www.sashido.io/en/) application.  

# Install

Run the following command to install.

```sh
npm install @sashido/teachablemachine-node
```
OR

```sh
yarn add @sashido/teachablemachine-node
```


# Usage

1. Train and your [Teachable Machine](https://teachablemachine.withgoogle.com/train) image model. Once certain it returns valid results, hit the Export option.

![](https://media-blog.sashido.io/content/images/2020/08/export_model_cursor.png)

2. Make sure that you select Tensorflow.js format when exporting. That way your model will be uploaded (for free) and you will receive an access URL.

![  ](https://media-blog.sashido.io/content/images/2020/08/export_tendorflow.js.png)

3. Pass the URL to SashiDo Teachable to load the model. Next, let it have the image URL and call `classify` to get the predictions.

# Example
```
const SashidoTeachable = require("@sashido/teachablemachine-node");

const model = new SashidoTeachable({
  modelUrl: "https://teachablemachine.withgoogle.com/models/kG5U1WBQe/"
});

model.classify({
  imageUrl: "https://cgtvm9ubnmtf2ckeqzvksppjgclcsk.files-sashido.cloud/9167d747f112142776f546815102e32b_1.png",
}).then((r) => {
  console.log("NSFW results:", r);
}).catch((e) => {
  console.log('ERROR', e);
});
```
# Contribute

Contributors of any kind are welcome. Share your awesome improvements in a pull request and take part in our mission to create affordable Machine Learning projects. 

# License

Copyright © 2020, CloudStrap AD. See LICENSE for further details.
