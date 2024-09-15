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

  async getUserById(userId: string): Promise<UsersModel> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect(
        'user.images',
        'image',
        'image.is_profile_image = :isProfileImage',
        { isProfileImage: true },
      )
      .where('user.id = :userId', { userId })
      .getOne();

    if (!user) {
      throw new BadRequestException('존재하지 않는 사용자입니다.');
    }

    // 프로필 이미지 설정
    user.profileImage =
      user.images && user.images.length > 0 ? user.images[0] : undefined;
    // images 속성 제거 (이미 @Exclude 데코레이터가 적용되어 있다고 가정)
    delete user.images;
    return user;
  }

  async getUsersByIds(ids: number[]): Promise<UsersModel[]> {
    return this.usersRepository.find({
      where: { id: In(ids) },
    });
  }

  async getUserByNickname(nickname: string): Promise<UsersModel> {
    const user = await this.usersRepository.findOne({ where: { nickname } });
    return user;
  }

  async getAllUsers(): Promise<UsersModel[]> {
    return this.usersRepository.find();
  }

  async getUserByEmail(email: string): Promise<UsersModel> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async updateProfileInfo(userId: number, updateDto: UpdateProfileDto) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }
    const existNickname = await this.usersRepository.exists({
      where: { nickname: user.nickname },
    });
    if (existNickname) {
      throw new BadRequestException('이미 존재하는 닉네임입니다.');
    }
    user.updateProfileInfo(updateDto);
    return this.usersRepository.save(user);
  }
}
