let fs = require("fs");
let path = require("path");

module.exports = async (filename) => {
  try {
    await fs.promises.unlink(
      path.join(__dirname, `../public/images/posts/${filename}`)
    );
  } catch (error) {
    console.log(error);
  }
};
