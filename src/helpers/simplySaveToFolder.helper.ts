import fs from 'fs';
import path from 'path';

// Define the function type
type saveFileToFolderType = (
  userImage: any,
  directoryName: string
) => Promise<string>;

export const simplySaveFileToFolder: saveFileToFolderType = async (
  userImage,
  directoryName
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const uploadFolder = path.resolve(directoryName);
      const fileExtension = path
        .extname(userImage.originalFilename)
        .toLowerCase();
      const randomName = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const newFilename = `${randomName}${fileExtension}`;
      const destPath = path.join(uploadFolder, newFilename);

      if (!fs.existsSync(uploadFolder)) {
        fs.mkdirSync(uploadFolder, { recursive: true });
      }

      // Copy the file to the destination folder
      await fs.promises.copyFile(userImage.filepath, destPath);

      resolve(destPath);
    } catch (error) {
      console.error('Error while saving the file:', error);
      reject(error);
    }
  });
};
