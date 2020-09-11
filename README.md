# SashiDo Teachable Machine v1.0.0

The package empowers you to load any image classification model trained with Teachable Machine in a Node.Js project.

# Install

- Install using npm 

```sh
npm install @sashido/teachablemachine-node
```

- Install using yarn

```sh
yarn add @sashido/teachablemachine-node
```


# Usage

### Create you own Model with Teachable Machine

1. Train and your [Teachable Machine](https://teachablemachine.withgoogle.com/train) image model. Once certain it returns valid results, hit the Export option.

![](https://media-blog.sashido.io/content/images/2020/09/tm_export_model.png)

2. Make sure that you select Tensorflow.js format when exporting. That way your model will be uploaded (for free) and you will receive an access URL.

![  ](https://media-blog.sashido.io/content/images/2020/08/export_tendorflow.js.png)

3. Pass the URL to SashiDoTeachable to load the model. Next, let it have the image URL and call `classify` to get the predictions.

### Play around with the model that SashiDo Team already trained.

SashiDo's team loves animals and it is no wonder that our first model was trained to recognize whether an image has a dog on it or no.As
😊 We've collected a dataset of more than 2000 images of dogs, cats, horses, other animals, people and everyday objects and uploaded them into two different classes into Teachable Machine. A big shoutout to [Unsplash.com](https://unsplash.com/) as a great plaform for free photos. Check it out in case you're just starting and do not have raw data yet.

You can load our **Dog <-> Not a Dog** model using the this URL and folloing the example below:

```
https://teachablemachine.withgoogle.com/models/mHPehnXQd/
```

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
