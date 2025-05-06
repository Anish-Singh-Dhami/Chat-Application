import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { configDotenv } from "dotenv";

configDotenv();

if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new Error("Cloudinary environment variables are not defined.");
}

try {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
} catch (error) {
  console.error("Failed to configure Cloudinary:", error);
  throw error;
}

type CloudinaryUploadResult = UploadApiResponse;

const deleteImageFromCloudinary = async (oldProfilePic: string) => {
  try {
    if (oldProfilePic) {
      await cloudinary.uploader.destroy(oldProfilePic);
    }
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    throw new Error("Failed to delete image from Cloudinary");
  }
};

const uploadToCloudinary = async (
  file: Express.Multer.File
): Promise<CloudinaryUploadResult> => {
  try {
    const buffer = Buffer.from(file.buffer);
    const uploadedResponse = await new Promise<CloudinaryUploadResult>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "image",
            folder: "profile_pics",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result as CloudinaryUploadResult);
            }
          }
        );
        uploadStream.end(buffer);
      }
    );

    return uploadedResponse;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new Error("Failed to upload image to Cloudinary");
  }
};
export { cloudinary, deleteImageFromCloudinary, uploadToCloudinary };
