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

  @Patch('/forgotPassword')
  forgotPassword(
    @Body() updatePasswordDto: { email: string; newPassword: string },
  ) {
    return this.userService.forgotPassword(
      updatePasswordDto.email,
      updatePasswordDto.newPassword,
    );
  }

  @Post('/email')
  async emailSend(@Body() emailDto: { email: string }) {
    const min = 100000; // the minimum 6-digit number
    const max = 999999; // the maximum 6-digit number
    const otp = Math.floor(Math.random() * (max - min + 1)) + min;
    return this.userService.sendEmail(emailDto.email, otp);
  }
}
