import { forwardRef, Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { MulterModule } from '@nestjs/platform-express';
import { multerOption } from '../../../common/utils/upload/multer-options';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UsersModule } from 'src/modules/users/users.module';
import { PostImagesModel } from './entities/postImages.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from '../posts.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([PostImagesModel]),
    MulterModule.register(multerOption),
    AuthModule,
    UsersModule,
    forwardRef(() => PostsModule),
  ],
  controllers: [ImagesController],
  providers: [ImagesService],
})
export class ImagesModule {}
