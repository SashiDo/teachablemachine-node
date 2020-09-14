# SashiDo Teachable Machine Node v1.0.0

# About

Google's Teachable Machine 2.0 makes AI easy for everyone, by offering a fast and fun way to train a real TensorFlow.js Machine Learning Models without any coding required. You can train the computer to recognize images, sounds, & poses, using your camera or your own dataset. 

The v.1.0.0 of this package empowers you to load any image classification model trained with Teachable Machine tool in a Node.Js project. Check out the [Roadmap](#Roadmap) of what comes next.

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

1. A fundamental first step is to [gather the samples](https://youtu.be/DFBbSTvtpy4) for your Teachable Machine Model. Use your camera to collect data or upload some preselected images.

2. [Train your Teachable Machine](https://teachablemachine.withgoogle.com/train?action=onboardOpen&id=CO67EQ0ZWgA) image model. Once certain it returns valid results, hit the Export option.

![](https://media-blog.sashido.io/content/images/2020/09/tm_export_model.png)

3. Make sure that you select Tensorflow.js format when exporting. That way your model will be uploaded (for free) and you will receive an access URL.

![  ](https://media-blog.sashido.io/content/images/2020/08/export_tendorflow.js.png)

4. Pass the URL to SashiDoTeachable to load the model. Next, let it have the image URL and call `classify` to get the predictions.

### Play around with the model that SashiDo Team already trained.

SashiDo's team loves animals and it is no wonder that our first model was trained to recognize whether an image has a dog on it or no.
😊 We've collected a dataset of more than 2000 images of dogs, cats, horses, other animals, people and everyday objects and uploaded them into two different classes with Teachable Machine.

![](https://media-blog.sashido.io/content/images/2020/09/example.gif)

A big shoutout to [Unsplash.com](https://unsplash.com/) as a great plaform for free photos. Check it out in case you're just starting and do not have raw data yet.

You can load our **Dog <-> Not a Dog** model using the this URL and folloing the example below:

```
https://teachablemachine.withgoogle.com/models/mHPehnXQd/
```

# Examples

1. Here's a quick example on how to load the model in your project.

```javascript
const TeachableMachine = require("@sashido/teachablemachine-node");

const model = new TeachableMachine({
  modelUrl: "https://teachablemachine.withgoogle.com/models/mHPehnXQd/"
});

model.classify({
  imageUrl: "https://media-blog.sashido.io/content/images/2020/09/SashiDo_Dog.jpg",
}).then((results) => {
  console.log("Results:", r);
}).catch((e) => {
  console.log("ERROR", e);
});
```

2. Here's a quick example with Express.

```javascript
const express = require("express");
const TeachableMachine = require("@sashido/teachablemachine-node");

const model = new TeachableMachine({
  modelUrl: "https://teachablemachine.withgoogle.com/models/mHPehnXQd/"
});

const app = express();
const port = 3000;

app.get("/image/classify", async (req, res) => {
  const { url } = req.query;

  return model.classify({
    imageUrl: url,
  }).then((results) => {
    console.log(results);
    return res.json(results);
  }).catch((e) => {
    console.error(e);
    res.status(500).send("Something is wrong!")
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
```

# Roadmap

In the long run we will add more options, so you can train and load all kinds of Teachable Machine Models.

 1. Add support of Pose Models. 
 
 2. Add support of Audio Models. 
 
 3. Add support for Gifs. 
 
 4. Add support for Videos.
 
We would love to have your opinion which's the one you would like to see supported first. Don't be shy and drop us a line at hello@sashido.io. 

# Contribute

Contributors of any kind are welcome. Share your awesome improvements in a pull request and take part in our mission to make Machine Learning affordable.

# License

Copyright © 2020, CloudStrap AD. See LICENSE for further details.
