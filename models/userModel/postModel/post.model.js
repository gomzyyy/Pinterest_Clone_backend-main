import mongoose, { Schema } from "mongoose";
import {
  CategoriesEnum,
  ReportPostEnum,
} from "../../../staticData/constants.js";

export const CategoryModel = new Schema({
  category: {
    type: String,
    enum: CategoriesEnum,
    default: "Education",
  },
  Others: {
    type: String,
  },
});
const Category = mongoose.model("Category", CategoryModel);

export const ReportPostModel = new Schema({
  reportType: {
    type: String,
    enum: ReportPostEnum,
    default: "Spam",
  },
  Others: {
    type: String,
  },
});
const ReportPost = mongoose.model("ReportPost", ReportPostModel);

const PostModel = new Schema(
  {
    title: {
      type: String,
      required: [true, "title is required."],
      maxLength: [60, "Title should not exceed 60 characters."],
      trim: true,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      type: String,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    reportStatus: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ReportPost",
      },
    ],
    visible: {
      type: Boolean,
      default: true,
    },
    removedOk: {
      type: Boolean,
      default: false,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    visits: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    tags: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    description: {
      type: String,
      default: "",
      trim: true,
    },
    downloadable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Post = mongoose.model("Post", PostModel);
