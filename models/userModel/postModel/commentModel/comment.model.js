import mongoose, { Schema } from "mongoose";
import { ReportCommentsEnum } from "../../../../staticData/constants.js";

const ReportCommentModel = new Schema({
  reportType: {
    type: String,
    enum: ReportCommentsEnum,
    default: "Spam",
  },
  Others: {
    type: String,
    maxLength: [20, "Category can't exceed 20 characters"],
  },
});

const ReportComment = mongoose.model("ReportComment", ReportCommentModel);

const ReplyModel = new Schema({
  text: {
    type: String,
    required: [true, "Comment should not be empty!"],
    maxLength: [120, "Comment should not exceed 120 characters."],
    trim: true,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  dislikes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  replies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reply",
      trim: true,
    },
  ],
  reportStatus: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ReportComment",
    },
  ],
  visible: {
    type: Boolean,
    default: true,
  },
  hidden:{
    type:Boolean,
    default:false
  }
});

const Reply = mongoose.model("Reply", ReplyModel);

const CommentModel = new Schema(
  {
    text: {
      type: String,
      required: [true, "Comment should not be empty!"],
      maxLength: [120, "Comment should not exceed 120 characters."],
      trim: true,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    dislikes: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reply",
        trim: true,
      },
    ],
    reportStatus: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ReportComment",
      },
    ],
    visible: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Comment = mongoose.model("Comment", CommentModel);
