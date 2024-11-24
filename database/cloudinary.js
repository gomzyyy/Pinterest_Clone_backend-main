import { v2 as cloudinary } from "cloudinary";

const mediaDB = async (imagePath) => {
  // console.log(imagePath)
  try {
    cloudinary.config({
      cloud_name: "dgki5gnzf",
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    // console.log("uploading")
    const cloudinaryResponse = await cloudinary.uploader.upload(imagePath);
    if(cloudinaryResponse.url!==null){
      return cloudinaryResponse.url;
    }
  } catch (error) {
    return res.status(e.INTERNAL_SERVER_ERROR.code).json({
      message: error.message ? error.message : "Unknown error occured!",
      success: false,
    });
  }
};

export default mediaDB;
