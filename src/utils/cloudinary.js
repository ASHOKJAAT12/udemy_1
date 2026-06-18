import {v2 as cloudinary} from 'cloudinary';
import { ApiError } from './ApiError.js';
import fs from 'fs';
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if ( !localFilePath ) {
            throw new ApiError(400,"cloudinary upload faild because file path not provide.")
            return null;
        }
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: 'auto'
        });    
        if ( fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return response;    
    } catch (error) {
        throw new ApiError(400,"faild to upload on cloudinary.",error?.message || error);
        if ( localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath)
        }
        return null;
    }
}

const deleteFromCloudinary = async ( localFilePath ) => {
    try {
        const response = await cloudinary.uploader.destroy(localFilePath);
    } catch (error) {
        throw new ApiError(400,"faild too delete from cloudinary");
    }
}

export { uploadOnCloudinary, deleteFromCloudinary };