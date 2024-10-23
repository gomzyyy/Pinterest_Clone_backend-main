import { v2 as cloudinary } from "cloudinary";

const mediaDB = async (imagePath) => {
  console.log(imagePath)
  try {
    cloudinary.config({
      cloud_name: "dgki5gnzf",
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    console.log("uploading")
    const cloudinaryResponse = await cloudinary.uploader.upload(imagePath);
    console.log(cloudinaryResponse);
    return cloudinaryResponse.url;
  } catch (error) {
    console.log(error);
  }
};

export default mediaDB;
