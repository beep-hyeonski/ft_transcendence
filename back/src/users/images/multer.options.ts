import { BadRequestException } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { v1 } from 'uuid';

export const multerOptions = {
  fileFilter: (request, file, cb) => {
    if (file.mimetype.match(/(jpg|jpeg|png)$/)) {
      cb(null, true);
    } else {
      cb(new BadRequestException('Not Supported Format'), false);
    }
  },
  storage: diskStorage({
    destination: (request, file, cb) => {
      const uploadPath = 'images';
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath);
      }
      cb(null, uploadPath);
    },
    filename: (request: any, file, cb) => {
      request.avatarUUID = v1() + '.' + file.mimetype.split('/')[1];
      cb(null, request.avatarUUID);
    },
  }),
};
