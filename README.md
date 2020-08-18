# SashiDo Teachable Machine v1.0.0


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
