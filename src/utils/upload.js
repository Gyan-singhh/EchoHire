import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout: 60000,
});

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

class CloudinaryUploadError extends Error {
  constructor(message) {
    super(`Cloudinary upload failed: ${message}`);
    this.name = "CloudinaryUploadError";
  }
}

export const uploadFile = async (file) => {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error(
      "Invalid file type. Only JPEG, PNG, WebP, and PDF are allowed"
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const uploadResponse = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder:
          file.type === "application/pdf"
            ? "cloudinary_pdfs"
            : "cloudinary_images",
        public_id:
          file.type === "application/pdf"
            ? `pdf_${Date.now()}`
            : `img_${Date.now()}`,
        use_filename: true,
        unique_filename: false,
        timeout: 60000,
        chunk_size: 6000000,
      },
      (error, result) => {
        if (error) {
          reject(new CloudinaryUploadError(error.message));
        } else if (!result) {
          reject(
            new CloudinaryUploadError("No result returned from Cloudinary")
          );
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(buffer);
  });

  return {
    url: uploadResponse.secure_url,
    publicId: uploadResponse.public_id,
    format: uploadResponse.format,
    bytes: uploadResponse.bytes,
  };
};
