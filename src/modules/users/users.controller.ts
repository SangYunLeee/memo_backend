import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersModel } from './entity/users.entity';
import { Get, Param, Body, Post } from '@nestjs/common';
import { User } from './decorator/user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMyUser(@User() user: UsersModel): { user: UsersModel } {
    return { user };
  }

  @Get(':id')
  getUserById(@Param('id') id: string): Promise<UsersModel> {
    return this.usersService.getUserById(id);
  }

  @Get()
  getAllUsers(): Promise<UsersModel[]> {
    return this.usersService.getAllUsers();
  }
}
