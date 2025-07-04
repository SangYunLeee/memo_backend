import { Body, Controller, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersModel } from './entity/users.entity';
import { Get, Param, UseGuards } from '@nestjs/common';
import { User } from './decorator/user.decorator';
import { AccessTokenGuard } from '../auth/guard/bearer-token.guard';
import { IsPublic } from 'src/common/decorator/is-public.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @IsPublic()
  @Get('me')
  async getMyUser(@User('id') userId: number) {
    if (!userId) {
      return { user: null };
    }
    const user = await this.usersService.getUserById(userId);
    return { user };
  }

  @Get(':id')
  async getUserById(@Param('id') id: number) {
    const user = await this.usersService.getUserById(id);
    return { user };
  }

  @IsPublic()
  @Get('nickname/:nickname')
  async getUserByNickname(@Param('nickname') nickname: string) {
    console.log('nickname:', nickname);
    const user = await this.usersService.getUserByNickname(nickname);
    console.log('user: ', user);
    return { user };
  }

  @Patch('me/profile')
  async updateMyProfileInfo(
    @User('id') userId: number,
    @Body() updateDto: UpdateProfileDto,
  ) {
    const updatedUser = await this.usersService.updateProfileInfo(
      userId,
      updateDto,
    );
    return { user: updatedUser };
  }
}
