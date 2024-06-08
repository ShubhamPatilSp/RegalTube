import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'


    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_APT_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    }); 

    const uploadOnCloudinary = async (localFilePath) =>{
        try {
            if(!localFilePath) return null;
            //upload the file on the cloudinary
         const response = await  cloudinary.uploader.upload(localFilePath,{
                resource_type: "auto"
            })    
            //file has been successfully uploaded
            // console.log("File successfully Cloudinary",
            //  response.url);
            fs.unlinkSync(localFilePath)
            return response;
        } catch (error) {
            fs.unlinkSync(localFilePath)// remove the local saved temporary file as the upload operation failed 
            return null;
        }
    }
export {uploadOnCloudinary} 