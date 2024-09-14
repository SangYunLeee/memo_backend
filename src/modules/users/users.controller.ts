import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersModel } from './entity/users.entity';
import { Get, Param, UseGuards } from '@nestjs/common';
import { User } from './decorator/user.decorator';
import { AccessTokenGuard } from '../auth/guard/bearer-token.guard';
import { IsPublic } from 'src/common/decorator/is-public.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(AccessTokenGuard)
  getMyUser(@User() user: UsersModel): { user: UsersModel } {
    return { user };
  }

  @Get('id/:id')
  async getUserById(@Param('id') id: string) {
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

  @Get()
  getAllUsers(): Promise<UsersModel[]> {
    return this.usersService.getAllUsers();
  }
}
