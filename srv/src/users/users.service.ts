import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { Repository } from 'typeorm';

interface IUsersResponse {
  totalCount: number;
  users: UsersEntity[];
}

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UsersEntity)
    private usersRepo: Repository<UsersEntity>,
  ) {}

  // get list of all users
  async findAll(): Promise<IUsersResponse> {
    return Promise.all([this.usersRepo.count(), this.usersRepo.find()]).then(([totalCount, users]) => ({
      totalCount,
      users,
    }));
  }

  // get list of users by page
  async findByPage(page: string): Promise<IUsersResponse> {
    return Promise.all([this.usersRepo.count(), this.usersRepo.find()]).then(([totalCount, users]) => ({
      totalCount,
      users: users.splice(20 * Number(page) - 20, 20),
    }));
  }
}
