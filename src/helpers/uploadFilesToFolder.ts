import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';
import { ar7id } from './ar7Id';

const algorithm = 'aes-256-cbc'; // No longer needed for encryption

// Define the function type
type saveFileToFolderType = (
  userImage: any,
  directoryName: string
) => Promise<string>;

export const saveFileToFolder: saveFileToFolderType = async (
  userImage,
  directoryName
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const uploadFolder = path.resolve(directoryName);
      const randomName = ar7id();
      const fileExtension = path
        .extname(userImage.originalFilename)
        .toLowerCase();
      const isImage = [
        '.jpg',
        '.jpeg',
        '.png',
        '.gif',
        '.bmp',
        '.tiff',
        '.webp',
        '.avif',
      ].includes(fileExtension);
      const newFilename = isImage
        ? `${randomName}.webp`
        : `${randomName}${fileExtension}`;
      const destPath = path.join(uploadFolder, newFilename);

      if (!fs.existsSync(uploadFolder)) {
        fs.mkdirSync(uploadFolder, { recursive: true });
      }

      let fileBuffer;

      if (isImage) {
        // Convert image to WebP before saving
        const imageBuffer = await sharp(userImage.filepath)
          .webp({ quality: 80 }) // Adjust quality as needed
          .toBuffer();
        fileBuffer = imageBuffer;
      } else {
        fileBuffer = await fs.promises.readFile(userImage.filepath);
      }

      // Save the file directly (no encryption)
      await fs.promises.writeFile(destPath, fileBuffer);

      resolve(destPath);
    } catch (error) {
      console.error('Error while saving the file:', error);
      reject(error);
    }
  });
};
