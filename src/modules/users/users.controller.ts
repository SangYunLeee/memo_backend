import { Body, Controller, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './decorator/user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiEndpoint } from 'src/common/decorator/api-docs.decorator';
import { UsersApiSpec } from './users.api-spec';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiEndpoint(UsersApiSpec.getMe)
  async getMyUser(@User('id') userId: number) {
    if (!userId) {
      return { user: null };
    }
    const user = await this.usersService.getUserById(userId);
    return { user };
  }

  @ApiEndpoint(UsersApiSpec.getUserById)
  async getUserById(@Param('id') id: number) {
    const user = await this.usersService.getUserById(id);
    return { user };
  }

  @ApiEndpoint(UsersApiSpec.getUserByNickname)
  async getUserByNickname(@Param('nickname') nickname: string) {
    const user = await this.usersService.getUserByNickname(nickname);
    return { user };
  }

  @ApiEndpoint(UsersApiSpec.updateMyProfile)
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
