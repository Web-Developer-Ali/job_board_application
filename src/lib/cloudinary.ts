import cloudinary from 'cloudinary';
import fs from 'fs';

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Define the types for the result and error parameters
type UploadResult = {
  public_id: string;
  secure_url: string;
};

// Upload function to Cloudinary
const uploadOnCloudinary = async (filePath: string, folder: string): Promise<UploadResult> => {
  return new Promise<UploadResult>((resolve, reject) => {
    cloudinary.v2.uploader.upload_stream(
      {
        resource_type: 'auto',
        folder: folder,
      },
      (err, result) => {
        if (err) {
          console.error('Error during image upload:', err);
          return reject(err);
        } else if (result) {
          return resolve({
            public_id: result.public_id,
            secure_url: result.secure_url,
          });
        } else {
          return reject(new Error('Unknown error occurred during upload'));
        }
      }
    ).end(fs.readFileSync(filePath));
  });
};

// Delete function for Cloudinary image
const deleteFromCloudinary = async (publicId: string): Promise<{ result: string }> => {
  return new Promise<{ result: string }>((resolve, reject) => {
    cloudinary.v2.uploader.destroy(publicId, (err, result) => {
      if (err) {
        console.error('Error during image deletion:', err);
        return reject(err);
      } else if (result && result.result === 'ok') {
        return resolve({ result: 'ok' }); // Return a result object with status 'ok'
      } else {
        return reject(new Error('Failed to delete image or image not found'));
      }
    });
  });
};

export { uploadOnCloudinary, deleteFromCloudinary };
