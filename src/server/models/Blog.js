import mongoose from "mongoose";
import Comment from "./Comment.js";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    url: String,
    category: {
      type: [String],
      required: true,
    },
    likes: Number,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true, strict: false }
);

blogSchema.post("findOneAndDelete", async function deleteRelatedComments(doc) {
  if (doc) {
    await Comment.deleteMany({ _id: { $in: doc.comments } });
  }
});

export const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);
