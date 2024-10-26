import mongoose, { Schema } from "mongoose";
import { ReportPostEnum } from "../../staticData/constants.js";

const ReportUserModel = new Schema({
  reportType: {
    type: String,
    enum: ReportPostEnum,
    default: "Spam",
  },
  Others: {
    type: String,
    maxLength: [20, "Category can't exceed 20 characters"],
  },
});
const ReportUser = mongoose.model("ReportUser", ReportUserModel);
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const UserModel = new Schema(
  {
    userName: {
      type: String,
      required: [true, "Username is required."],
    },
    userId: {
      type: String,
      required: [true, "user ID is required."],
      unique: true,
    },
    email: {
      type: String,
      required: false,
      validate: {
        validator: (v) => emailRegex.test(v),
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    password: {
      type: String,
      required: [true, "password is required."],
    },
    otp: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Otp",
    },
    avatar: {
      type: String,
      default: "",
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    followers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    bio: {
      type: String,
    },
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    reportStatus: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ReportUser",
      },
    ],
    isDisabled: {
      type: Boolean,
      default: false,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    premiumUser: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: String,
      enum: ["male", "female", "others"],
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
    age: {
      type: Number,
      get: function () {
        if (!this.dateOfBirth) return null;
        const now = new Date();
        const birthDay = new Date(this.dateOfBirth);
        let ageInYear = now.getFullYear() - birthDay.getFullYear();
        const monthDifference = now.getMonth() - birthDay.getMonth();
        if (
          monthDifference < 0 ||
          (monthDifference === 0 && now.getDate() < birthDay.getDate())
        ) {
          ageInYear--;
        }
        return ageInYear;
      },
    },
    verified: {
      type: Boolean,
      default: false,
    },
    lastLoggedIn: {
      type: Date,
      set: function (value) {
        return value ? new Date(value) : new Date();
      },
      get: function (value) {
        return value ? value.toDateString() : null;
      },
    },
    timeSinceLoggedIn: {
      type: Number,
      get: function () {
        if (!this.lastLoggedIn) return null;
        const now = new Date();
        const timeDifferenceMs = now - this.lastLoggedIn;
        const differenceInMins = Math.floor(timeDifferenceMs / 1000 / 60);
        return differenceInMins;
      },
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", UserModel);
