import PostModel from "../models/Post.js";
export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("user").exec();
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to get a post",
    });
  }
};
export const getOne = async (req, res) => {
  // try {
  //   const postId = req.params.id;
  //   PostModel.findOneAndUpdate(
  //     {
  //       _id: postId,
  //     },
  //     {
  //       $inc: { viewsCount: 1 },
  //     },
  //     {
  //       returnDocument: "after",
  //     },
  //     (error, doc) => {
  //       if (error) {
  //         console.log(error);
  //         return res.status(500).json({
  //           message: "Failed to get back a post",
  //         });
  //       }
  //       if (!doc) {
  //         return res.status(404).json({
  //           message: "Post is not found",
  //         });
  //       }
  //       res.json(doc);
  //     }
  //   ).populate("user");
  // } catch (error) {
  //   console.log(error);
  //   res.status(500).json({
  //     message: "Failed to get or update the post",
  //   });
  // }
  try {
    const postId = req.params.id;

    const updatedPost = await PostModel.findOneAndUpdate(
      { _id: postId },
      { $inc: { viewsCount: 1 } },
      { returnDocument: "after" }
    ).populate("user");

    if (!updatedPost) {
      return res.status(404).json({
        message: "Post is undefined",
      });
    }

    res.json(updatedPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to get or update the post",
    });
  }
};
export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    const deletedPost = await PostModel.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(404).json({
        message: "Post not found or already deleted",
      });
    }

    res.json({
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to delete the post",
    });
  }
};
export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.split(","),
      user: req.userId,
    });
    const post = await doc.save();
    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to create a post",
    });
  }
};
export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    // Check if imageUrl is included in the request body, and update it accordingly
    const updateData = {
      title: req.body.title,
      text: req.body.text,
      user: req.userId,
      tags: req.body.tags.split(","),
    };

    if (req.body.imageUrl) {
      updateData.imageUrl = req.body.imageUrl;
    }

    const updatedPost = await PostModel.findByIdAndUpdate(postId, updateData, {
      new: true,
    });

    if (!updatedPost) {
      return res.status(404).json({
        message: "Post not found or already deleted",
      });
    }

    res.json({
      success: true,
      updatedPost,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update the post",
    });
  }
};
export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);
    res.json(tags);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to get a tag",
    });
  }
};
