import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import refineUrlAr7 from './refineUrlAr7';
import { removePublicPrefix } from '../helpers_v2/others/removePublicPrefix';

// Define the function type
type saveFileToFolderType = (
  userFile: any,
  directoryName: string
) => Promise<string>;

export const saveAnyFileToFolder: saveFileToFolderType = async (
  userFile,
  directoryName
) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Log the file buffer and directory for debugging

      // Set the upload folder path
      const uploadFolder = path.resolve(directoryName);

      // Generate a random file name
      const randomName = crypto.randomBytes(16).toString('hex');

      // Assuming the file is always a PDF, set the extension to '.pdf'
      const fileExtension = '.pdf';

      // Create the new filename
      const newFilename = `${randomName}${fileExtension}`;

      // Define the destination path
      const destPath = path.join(uploadFolder, newFilename);

      // Create the folder if it doesn't exist
      if (!fs.existsSync(uploadFolder)) {
        fs.mkdirSync(uploadFolder, { recursive: true });
      }

      // Convert the ArrayBuffer to Buffer before writing the file
      const fileBuffer = Buffer.from(userFile.buffer);

      // Write the PDF buffer directly to the destination path
      await fs.promises.writeFile(destPath, fileBuffer);

      // Return the URL of the saved file
      let fileUrl = `${directoryName}/${newFilename}`;
      fileUrl = removePublicPrefix(fileUrl);
      resolve(fileUrl);
    } catch (error) {
      console.error('Error while saving the file:', error);
      reject(error);
    }
  });
};
