let Post = require("../models/Post");
let multer = require("multer");
let path = require("path");

let multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/images/posts"));
  },
  filename: (req, file, cb) => {
    let extension = file.mimetype.split("/")[1];

    cb(null, `post-${req.user._id}-${Date.now()}.${extension}`);
  },
});

let multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    let error = new Error("Not an image please upload only images");
    cb(error, false);
  }
};

let upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.upload = upload.single("image");

exports.createPost = async (req, res) => {
  try {
    let post = await Post.create({
      title: req.body.title,
      description: req.body.description,
      author: req.user._id,
      image: req.file.filename,
    });
    res.status(201).json({
      status: "success",
      post,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      error: err,
    });
  }
};

exports.getAllPosts = async (req, res) => {
  let posts = await Post.find().populate({
    path: "author",
    select: "name lastName email",
  });

  res.json({
    status: "success",
    result: posts.length,
    posts,
  });
};
