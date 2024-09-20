import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from './entity/users.entity';
import { In, Repository } from 'typeorm';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly usersRepository: Repository<UsersModel>,
  ) {}

  async createUser(
    user: Pick<UsersModel, 'nickname' | 'email' | 'password'>,
  ): Promise<UsersModel> {
    const existNickname = await this.usersRepository.exists({
      where: { nickname: user.nickname },
    });
    if (existNickname) {
      throw new BadRequestException('이미 존재하는 닉네임입니다.');
    }

    const existEmail = await this.usersRepository.exists({
      where: { email: user.email },
    });
    if (existEmail) {
      throw new BadRequestException('이미 존재하는 이메일입니다.');
    }

    return this.usersRepository.save(user);
  }

  private async getUsersWithProfileImage(options?: {
    userIds?: number[];
    email?: string;
    nickname?: string;
  }): Promise<UsersModel[]> {
    const queryBuilder = this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect(
        'user.profileImage',
        'image',
        'image.is_profile_image = :isProfileImage',
        { isProfileImage: true },
      );

    if (options?.userIds && options.userIds.length > 0) {
      queryBuilder.where('user.id IN (:...userIds)', {
        userIds: options.userIds,
      });
    } else if (options?.email) {
      queryBuilder.where('user.email = :email', { email: options.email });
    } else if (options?.nickname) {
      queryBuilder.where('user.nickname = :nickname', {
        nickname: options.nickname,
      });
    }

    const users = await queryBuilder.getMany();

    return users;
  }

  async getUserById(userId: number): Promise<UsersModel> {
    const users = await this.getUsersWithProfileImage({ userIds: [userId] });
    if (users.length === 0) {
      throw new BadRequestException('존재하지 않는 사용자입니다.');
    }
    return users[0];
  }

  async getUsersByIds(ids: number[]): Promise<UsersModel[]> {
    return this.getUsersWithProfileImage({ userIds: ids });
  }

  async getUserByNickname(nickname: string): Promise<UsersModel> {
    const users = await this.getUsersWithProfileImage({ nickname });
    if (users.length === 0) {
      throw new BadRequestException('존재하지 않는 닉네임입니다.');
    }
    return users[0];
  }

  async getUserByEmail(email: string): Promise<UsersModel> {
    const users = await this.getUsersWithProfileImage({ email });
    if (users.length === 0) {
      throw new BadRequestException('존재하지 않는 이메일입니다.');
    }
    return users[0];
  }

  async updateProfileInfo(userId: number, updateDto: UpdateProfileDto) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    if (updateDto.nickname !== user.nickname) {
      const existNickname = await this.usersRepository.exists({
        where: { nickname: updateDto.nickname },
      });
      if (existNickname) {
        throw new BadRequestException('이미 존재하는 닉네임입니다.');
      }
    }

    user.updateProfileInfo(updateDto);
    this.usersRepository.save(user);
    return this.getUsersWithProfileImage({ userIds: [userId] })[0];
  }
}
