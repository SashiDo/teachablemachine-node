# SashiDo Teachable Machine v1.0.0

This module empowers you to load any image classification models trained with Teachable Machine in a Node.JS environment. 

# Install

Run the following line to your Node.JS project directory.

`npm install @sashido/teachablemachine-node`

# Usage

1. Train and your [Teachable Machine](https://teachablemachine.withgoogle.com/train) image model. Once certain it returns valid results, hit the Export option.

![](https://media-blog.sashido.io/content/images/2020/08/export_model_cursor.png)

2. Make sure that you select Tensorflow.js format when exporting. That way your model will be uploaded (for free) and you will receive an access URL.

3. Pass the URL to SashiDo Teachable and use the classify method to get predictions.

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
# Pull requests Welcome

Contributions of any kind are welcome to share their awesome ideas and take part in creating affordable Machine Learning projects. 

# License

Copyright © 2020, CloudStrap AD. See LICENSE for further details.
