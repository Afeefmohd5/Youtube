import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadOnCloudinary = async (localfilePath) => {
 try {
    if(!localfilePath) return null;
   const respone = cloudinary.uploader.upload(localfilePath,{
        resource_type: "auto",
    })
    //File uploaded successfully
    console.log("File uploaded successfully on cloudinary", respone.url);
    return respone;
 } catch (error) {
    fs.unlinkSync(localfilePath); // Delete the file if upload fails
    console.error("Error uploading file to Cloudinary:", error);
    return null;
 }

}

export {uploadOnCloudinary};