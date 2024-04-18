import { UserService } from './users.service';
import { Controller, Get, Logger, Param } from '@nestjs/common';
import { UsersResponseDto } from './users.response.dto';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private userService: UserService) {}

  @Get()
  async getAllUsers() {
    const { users, totalCount } = await this.userService.findAll();
    return { users: users.map((user) => UsersResponseDto.fromUsersEntity(user)), totalCount };
  }

  @Get(':params')
  async getUsersByPage(@Param('params') params: string) {
    const { totalCount, users } = await this.userService.findByPageAndTotal(params)
    return { users: users.map((user) => UsersResponseDto.fromUsersEntity(user)), totalCount };
  }
}
