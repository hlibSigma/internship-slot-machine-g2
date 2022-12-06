var texturepackerify = require("texturepackerify");

texturepackerify.pack({ url: "./src/assets/atlases/", hashUrl: "./assets/", force: false }, () => {
    console.log("assets built");
});
