import { createHash } from 'crypto';
import {
  getImagePath,
  POSTS_FOLDER_NAME,
  PROFILE_FOLDER_NAME,
  TEMP_FOLDER_PATH,
} from './multer-path';
import * as multer from 'multer';
import { join } from 'path';

export const multerOption = {
  // file size limit 5MB
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const isImageUpload = req.path.includes('images');
    if (isImageUpload) {
      const isValidImageType = file.mimetype.match(/\/(jpg|jpeg|png|gif)$/);
      if (!isValidImageType) {
        cb(new Error('지원하지 않는 파일 형식입니다.'), false);
      }
    }
    cb(null, true);
  },
  storage: multer.diskStorage({
    destination: ((req, file, cb) => {
      return TEMP_FOLDER_PATH;
    })(),
    filename: (req, file, cb) => {
      const now = new Date(Date.now());
      const year = now.getFullYear().toString().slice(2);
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0'); // 일
      const hours = now.getHours().toString().padStart(2, '0'); // 시
      const minutes = now.getMinutes().toString().padStart(2, '0'); // 분
      const seconds = now.getSeconds().toString().padStart(2, '0'); // 초
      const formattedDate = `${year}${month}${day}${hours}${minutes}${seconds}`;

      const type =
        (req.path.startsWith('/users/me/profile/images') && 'profile') ||
        (req.path.startsWith('/posts') && 'post') ||
        undefined;

      if (!type) {
        return cb(new Error('Invalid path'), '');
      }

      const map = {
        post: `post__${req.params.postId}`,
        profile: 'profile',
      };
      cb(
        null,
        // file name format: 20210723123456__userId_1__filename_originalname.jpg
        `${formattedDate}__user__${req.user.id}__${map[type]}__${file.originalname}`,
      );
    },
  }),
};

/**
 * 파일 이름을 해싱하여 경로를 생성하는 함수
 * @param filename 원본 파일 이름
 * @returns 해싱된 경로
 */
export function generateHashedPath(
  filename: string,
  uploadType: 'postImage' | 'profileImage' | 'postFile',
): string {
  // 240905160349__user__8__post__30__k6-테스트-2-병목.drawio.png
  const split = filename.split('__');
  const originFilename = split[split.length - 1];
  // md5 해시 생성
  const hash = createHash('md5').update(originFilename).digest('hex');

  // 해시의 앞 6자리를 사용해 폴더 구조 생성
  const folder1 = hash.slice(0, 2); // ex: '1a'
  const folder2 = hash.slice(2, 4); // ex: '2b'
  const folder3 = hash.slice(4, 6); // ex: '3c'

  const map = {
    postImage: `${POSTS_FOLDER_NAME}/images`,
    profileImage: `${PROFILE_FOLDER_NAME}/images`,
    postFile: `${POSTS_FOLDER_NAME}/files`,
  };
  const basePath = map[uploadType];
  return join(getImagePath(basePath), folder1, folder2, folder3);
}
