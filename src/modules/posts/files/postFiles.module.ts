import { forwardRef, Module } from '@nestjs/common';
import { PostFilesService } from './postFiles.service';
import { PostFilesController } from './postFiles.controller';
import { MulterModule } from '@nestjs/platform-express';
import { multerOption } from '../../../common/utils/upload/multer-options';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UsersModule } from 'src/modules/users/users.module';
import { PostFilesModel } from './entities/postFiles.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from '../posts.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([PostFilesModel]),
    MulterModule.register(multerOption),
    AuthModule,
    UsersModule,
    forwardRef(() => PostsModule),
  ],
  controllers: [PostFilesController],
  providers: [PostFilesService],
})
export class PostFilesModule {}
