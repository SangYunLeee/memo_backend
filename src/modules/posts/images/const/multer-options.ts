import { createHash } from 'crypto';
import { POSTS_IMAGES_FOLDER_PATH, TEMP_FOLDER_PATH } from './multer-path';
import * as multer from 'multer';
import { join } from 'path';

export const multerOption = {
  // file size limit 5MB
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      cb(null, true);
    } else {
      cb(new Error('지원하지 않는 파일 형식입니다.'), false);
    }
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
      cb(
        null,
        // file name format: 20210723123456__userId_1__filename_originalname.jpg
        `${formattedDate}__user__${req.user.id}__post__${req.params.postId}__${file.originalname}`,
      );
    },
  }),
};

/**
 * 파일 이름을 해싱하여 경로를 생성하는 함수
 * @param filename 원본 파일 이름
 * @returns 해싱된 경로
 */
export function generateHashedPath(filename: string): string {
  // 240905160349__user__8__post__30__k6-테스트-2-병목.drawio.png
  const split = filename.split('__');
  const originFilename = split[split.length - 1];
  // md5 해시 생성
  const hash = createHash('md5').update(originFilename).digest('hex');

  // 해시의 앞 6자리를 사용해 폴더 구조 생성
  const folder1 = hash.slice(0, 2); // ex: '1a'
  const folder2 = hash.slice(2, 4); // ex: '2b'
  const folder3 = hash.slice(4, 6); // ex: '3c'

  // 최종 경로 생성
  return join(POSTS_IMAGES_FOLDER_PATH, folder1, folder2, folder3);
}
