import fs from 'fs';
import crypto from 'crypto';
import { encryptionSecretKey } from '../../data/environmentVariables';
const algorithm = 'aes-256-cbc';
export const decryptFileAR7 = async (filePath: string): Promise<Buffer> => {
  try {
    const encryptedData = await fs.promises.readFile(filePath);
    const iv = encryptedData.slice(0, 16); // Extract the IV (the first 16 bytes)
    const encryptedBuffer = encryptedData.slice(16); // The rest is the encrypted data

    const decipher = crypto.createDecipheriv(
      algorithm,
      encryptionSecretKey,
      iv
    );
    const decryptedBuffer = Buffer.concat([
      decipher.update(encryptedBuffer),
      decipher.final(),
    ]);

    return decryptedBuffer;
  } catch (error: any) {
    throw new Error('Error while decrypting the file: ' + error.message);
  }
};
