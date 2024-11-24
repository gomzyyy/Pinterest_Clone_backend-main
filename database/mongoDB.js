import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB1_URI);
    // console.log("MongoDB connected");
  } catch (error) {
    return res.status(e.INTERNAL_SERVER_ERROR.code).json({
      message:
        error instanceof Error
          ? error.message
          : "Cannot connect to the database.",
      success: false,
    });
  }
};

export default connectMongoDB;
