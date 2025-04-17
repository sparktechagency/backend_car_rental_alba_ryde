import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';
import { encryptionSecretKey } from '../data/environmentVariables';

const algorithm = 'aes-256-cbc';

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
      const randomName = crypto.randomBytes(16).toString('hex');
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
        // Convert image to WebP before encryption
        const imageBuffer = await sharp(userImage.filepath)
          .webp({ quality: 80 }) // Adjust quality as needed
          .toBuffer();
        fileBuffer = imageBuffer;
      } else {
        fileBuffer = await fs.promises.readFile(userImage.filepath);
      }

      // Encrypt the file
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(algorithm, encryptionSecretKey, iv);
      const encryptedBuffer = Buffer.concat([
        iv,
        cipher.update(fileBuffer),
        cipher.final(),
      ]);

      // Save the encrypted file
      await fs.promises.writeFile(destPath, encryptedBuffer);

      resolve(destPath);
    } catch (error) {
      console.error('Error while saving the file:', error);
      reject(error);
    }
  });
};
