import { forwardRef, Module } from '@nestjs/common';
import { ImagesService } from './userImages.service';
import { ImagesController } from './userImages.controller';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UsersModule } from 'src/modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserImagesModel } from './entity/usersImages.entity';
import { multerOption } from 'src/common/utils/upload/multer-options';
@Module({
  imports: [
    TypeOrmModule.forFeature([UserImagesModel]),
    MulterModule.register(multerOption),
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [ImagesController],
  providers: [ImagesService],
})
export class userImagesModule {}
