let Post = require("../models/Post");
let multer = require("multer");
let path = require("path");
let deletePic = require("../utils/deletePhots");

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

exports.editPost = async (req, res) => {
  try {
    let post = await Post.findOne({
      _id: req.params.postId,
      author: req.user._id,
    });

    if (!post) {
      return res.status(404).json({
        status: "failed",
        error: "post not found",
      });
    }

    let body = { ...req.body };
    if (req.file) {
      let oldFilename = post.image;
      body.image = req.file.filename;
      await deletePic(oldFilename);
    }

    let updatedPost = await Post.findByIdAndUpdate(post._id, body, {
      runValidators: true,
      new: true,
    });

    res.json({
      status: "success",
      post: updatedPost,
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      error: err,
    });
  }
};

exports.deletePost = async (req, res) => {
  try {
    let post = await Post.findOneAndDelete({
      _id: req.params.postId,
      author: req.user._id,
    });
    if (!post) {
      return res.status(404).json({
        status: "failed",
        error: "post not found",
      });
    }

    await deletePic(post.image);

    res.status(204).json({
      status: "success",
    });
  } catch (error) {
    res.status(404).json({
      status: "failed",
      error: err,
    });
  }
};
