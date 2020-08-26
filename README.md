# SashiDo Teachable Machine v1.0.0

The package empowers you to load any image classification model trained with Teachable Machine in a your SashiDo application.  

# Install

Each SashiDo application comes with a private GitHub repo that stores your server-side logic. Simply add the package to the package.json file of your project, you have two ways to go:

- Add the following line to your dependencies in the package.json
```
  "@sashido/teachablemachine-node": "1.0.0"

```
OR
 - Run the following command to your local project and then push changes to the SashiDo app's repo.

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
