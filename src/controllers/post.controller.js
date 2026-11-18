import Post from "../models/post.model.js";
import User from "../models/user.model.js";

const createPost = async (req, res) => {
  try {
    const { title, content, author } = req.body;

    // Check that all three fields are provided
    if (!title || !content || !author) {
      return res.status(400).json({
        message: "All fields (title, content, author) are required",
      });
    }

    // Verify that the author exists in the User collection
    const userExists = await User.findById(author);
    if (!userExists) {
      return res.status(404).json({
        message: "Author not found",
      });
    }

    // Create and save a new post
    const post = await Post.create({
      title,
      content,
      author,
    });

    return res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getAllPosts = async (req, res) => {
  try {
    // Fetch all posts and populate the author's username and email
    const posts = await Post.find().populate("author", "username email");

    return res.status(200).json({
      posts,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    // Find and update the post by ID
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { title, content },
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    return res.status(200).json({
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the post by ID
    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    return res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export { createPost, getAllPosts, updatePost, deletePost };
