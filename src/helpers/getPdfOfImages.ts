import PDFDocument from 'pdfkit';
import fs from 'fs';
import { decryptFileAR7 } from '../helpers_v2/encryption/decrypt.helper';
import sharp from 'sharp'; // Import sharp to handle image format conversion

export const getPdfOfImages = (arrayOfImageUrl: string[]) => {
  return new Promise<Buffer>(async (resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const buffers: Buffer[] = []; // To collect PDF chunks as a buffer

      // Hook the doc to collect data into a buffer instead of a file stream
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        // Resolve with the concatenated buffer when PDF is finished
        resolve(Buffer.concat(buffers));
      });

      for (let i = 0; i < arrayOfImageUrl.length; i++) {
        const singleAssetUrl = arrayOfImageUrl[i];
        const refinedAssetUrl = './public' + singleAssetUrl;
        let myImageFile: any;

        try {
          // Decrypt the image file
          const decryptedImage = await decryptFileAR7(refinedAssetUrl);
          if (decryptedImage) {
            myImageFile = decryptedImage;
          }
        } catch (error) {
          console.log(error);
        }

        if (myImageFile) {
          // Convert the decrypted image from WEBP to PNG (or JPEG)
          try {
            // Use sharp to convert the decrypted WEBP image to PNG
            const convertedImageBuffer = await sharp(myImageFile)
              .toFormat('png') // You can change to 'jpeg' if preferred
              .toBuffer();

            // Add the converted image to the PDF
            doc.addPage();
            doc.image(convertedImageBuffer, {
              fit: [500, 500], // Adjust the size as needed
              align: 'center',
              valign: 'center',
            });
          } catch (convertError) {
            console.log('Error converting image:', convertError);
            reject(convertError);
            return;
          }
        }
      }

      doc.end(); // Close the PDF and finish the writing process
    } catch (error) {
      console.log('Error generating PDF:', error);
      reject(error);
    }
  });
};
