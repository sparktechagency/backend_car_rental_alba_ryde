import { Request, Response, NextFunction } from 'express';
import { decryptFileAR7 } from '../../../../helpers_v2/encryption/decrypt.helper';
import path from 'path';
import fs from 'fs';

export const sendEncryptedFileController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const mediaFormats: { [key: string]: string } = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.bmp': 'image/bmp',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.avi': 'video/x-msvideo',
    '.mov': 'video/quicktime',
    '.mkv': 'video/x-matroska',
    '.flv': 'video/x-flv',
    '.wmv': 'video/x-ms-wmv',
  };

  const myFileUrl = './public' + req.url;
  console.log('Requesting file:', myFileUrl);

  const fileExt = path.extname(myFileUrl).toLowerCase();

  // If there is no file extension, call next() and return
  if (!fileExt) {
    return next();
  }

  // If the file extension is .pdf, skip and go to the next middleware
  if (fileExt === '.pdf') {
    return next();
  }

  try {
    const decryptedFileBuffer = await decryptFileAR7(myFileUrl);

    if (mediaFormats[fileExt]) {
      // If the file is an image or video, display inline
      res.setHeader('Content-Type', mediaFormats[fileExt]);
      // Optionally, you can remove the Content-Disposition header for known media types
      // res.setHeader('Content-Disposition', 'inline');
    } else {
      // If it's an unknown file type, force download
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${path.basename(myFileUrl)}"`
      );
    }

    res.send(decryptedFileBuffer);
  } catch (error) {
    console.error('Error while processing the file:', error);
    res.status(500).send('Error while processing the file');
  }
};
