import { UserService } from './users.service';
import { Controller, Get, Logger, Param } from '@nestjs/common';
import { UsersResponseDto } from './users.response.dto';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private userService: UserService) {}

  @Get()
  async getAllUsers() {
    this.logger.log('Get all users');
    const { users, totalCount } = await this.userService.findAll();
    return { users: users.map((user) => UsersResponseDto.fromUsersEntity(user)), totalCount };
  }

  @Get(':page')
  async getUsersByPage(@Param('page') page: string) {
    this.logger.log(`UsersByPage page: ${page}`);
    const { users, totalCount } = await this.userService.findByPage(page);
    return { users: users.map((user) => UsersResponseDto.fromUsersEntity(user)), totalCount };
  }
}
