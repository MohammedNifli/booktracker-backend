import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv'

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

type CloudinaryUploadResult = {
    secure_url: string;
    public_id: string;
    
  };
  
  
  export const uploadToCloudinary = async (file: File): Promise<CloudinaryUploadResult> => {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
  
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'book-covers',
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as CloudinaryUploadResult);
        }
      );
  
      uploadStream.end(buffer);
    });
  };
  