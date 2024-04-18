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
    const [users, totalCount] = await this.usersRepo.findAndCount({
      order: { id: 'ASC' },
    });
    return {totalCount, users}
  }

  // get list of users by page
  async findByPageAndTotal(params: string): Promise<IUsersResponse> {
    const [page, limit] = params.split(' ').map(el=>Number(el))

    const [users, totalCount] = await this.usersRepo.findAndCount({
      order: { id: 'ASC' },
      skip: limit * page - limit,
      take: limit,
    });

    return {totalCount, users}
  }
}
