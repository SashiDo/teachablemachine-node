# Teachable Machine Node

![teachable-machine-cover](https://media-blog.sashido.io/content/images/2020/09/teachable-machine-cover.png)

# About

**Teachable Machine Node** empowers you to load any image classification model trained with Google's Teachable Machine tool in a Node.Js project.

[Teachable Machine](https://teachablemachine.withgoogle.com/) makes AI easy for everyone, by offering a fast and fun way to train a real TensorFlow.js Machine Learning Models without any coding required. You can train the computer to recognize images, sounds, & poses, using your camera or your own dataset. Check [The Awesome Teachable Machine List](https://github.com/SashiDo/awesome-teachable-machine) full of useful resources and amazing projects to gain some cool ideas.


For now, Teachable Machine Node holds support only for image models, but we won't stop here. Check out the [Roadmap](#Roadmap) of what comes next!

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

1. [Gathering samples](https://youtu.be/DFBbSTvtpy4) is the fundamental first step to your Teachable Machine Model. Use your camera to collect data or upload some preselected images.

2. [Train your Teachable Machine Image Model](https://teachablemachine.withgoogle.com/train?action=onboardOpen&id=CO67EQ0ZWgA).

![](https://media-blog.sashido.io/content/images/2020/09/tm_export_model.png)

Check the `Advanced` option for further insights on the model performance and accuracy. Once certain it returns valid results, hit the Export option.

3. Make sure that you select Tensorflow.js format when exporting. That way your model will be uploaded (for free) and you will receive an access URL.

![  ](https://media-blog.sashido.io/content/images/2020/08/export_tendorflow.js.png)

4. Pass the URL to the teachablemachine-node to load the model. Next, let it have the image URL and call `classify` to get the predictions.

### Play around with our pre-trained 'Is It A Dog?' model.

SashiDo's team is full of notorious animal lovers and no wonder the sample model was trained to recognize dog pics from other images. 😊 We've collected a dataset of more than 2000 images of dogs, cats, horses, other animals, people and everyday objects and uploaded them into two different classes with Teachable Machine.

![](https://media-blog.sashido.io/content/images/2020/09/example.gif)

A big shoutout to [Unsplash.com](https://unsplash.com/) as a great platform for free photos. Check it out in case you're just starting and do not have raw data yet.

You can load our **Is_It_A_Dog** model using this URL and following the example below:

```
https://teachablemachine.withgoogle.com/models/r6BBk-hiN/
```

# Examples

### NodeJS

Here's a quick example of how to load the model in your project.

```javascript
const TeachableMachine = require("@sashido/teachablemachine-node");

const model = new TeachableMachine({
  modelUrl: "https://teachablemachine.withgoogle.com/models/r6BBk-hiN/"
});

model.classify({
  imageUrl: "https://media-blog.sashido.io/content/images/2020/09/SashiDo_Dog.jpg",
}).then((predictions) => {
  console.log("Predictions:", predictions);
}).catch((e) => {
  console.log("ERROR", e);
});
```

### ExpressJS

And the alternative for all Express fans.

```javascript
const express = require("express");
const TeachableMachine = require("@sashido/teachablemachine-node");

const model = new TeachableMachine({
  modelUrl: "https://teachablemachine.withgoogle.com/models/r6BBk-hiN/"
});

const app = express();
const port = 3000;

app.get("/image/classify", async (req, res) => {
  const { url } = req.query;

  return model.classify({
    imageUrl: url,
  }).then((predictions) => {
    console.log(predictions);
    return res.json(predictions);
  }).catch((e) => {
    console.error(e);
    res.status(500).send("Something went wrong!")
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
```

# Roadmap

In the long run, we will add more options, so you can train and load all kinds of Teachable Machine Models.

 1. Add support for Pose Models.

 2. Add support for Audio Models.

 3. Add support for Gifs.

 4. Add support for Videos.

We would love to have your opinion which's the one you would like to see supported first. Don't be shy and drop us a line at hello@sashido.io.

# Contribute

Contributors of any kind are welcome. Share your awesome improvements in a pull request and join our mission to make Machine Learning more affordable & accessible!

# License

Copyright © 2020, CloudStrap AD. See [LICENSE](https://github.com/SashiDo/teachablemachine-node/blob/master/LICENSE) for further details.
