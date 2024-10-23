import mongoose, { get, Schema } from "mongoose";

const otpModel = new Schema({
  otp: {
    type: Number,
    required: true,
  },
  generatedAt: {
    type: Date,
    default: Date.now,
    set: function (value) {
      return value ? new Date(value) : new Date();
    },
  },
  expiresAt: {
    type: Date,
    default: function () {
      return Date.now() + 10 * 60 * 1000;
    },
  },
});

otpModel.method.isExpired = () => {
  return Date.now() > this.expiresAt;
};

export const Otp = mongoose.model("Otp", otpModel);
