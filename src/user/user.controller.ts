import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './models/user.dto';
import { UserEntity } from './models/post.entity';
import { UpdateUserDto } from './models/updateUser.dto';
import { UpdatePasswordDto } from './models/updatePassword.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/signup')
  signup(@Body() userDto: UserDto): Promise<UserEntity> {
    return this.userService.signup(userDto);
  }

  @Post('/login')
  login(@Body() userDto: UserDto) {
    return this.userService.login(userDto);
  }

  @Patch('/update/:id')
  update(@Param('id') id, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateProfile(
      id,
      updateUserDto.email,
      updateUserDto.username,
    );
  }

  @Patch('/updatePassword/:id')
  updatePassword(
    @Param('id') id,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.userService.updatePassword(id, updatePasswordDto);
  }

  @Patch('/forgotPassword/:id')
  forgotPassword(
    @Param('id') id,
    @Body() updatePasswordDto: { newPassword: string },
  ) {
    return this.userService.forgotPassword(id, updatePasswordDto.newPassword);
  }
}
