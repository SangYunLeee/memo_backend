import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModel } from './entity/users.entity';
import { AuthModule } from '../auth/auth.module';
import { userImagesModule } from './images/userImages.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersModel]),
    forwardRef(() => AuthModule),
    userImagesModule,
  ],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
