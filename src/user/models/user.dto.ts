import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
  username: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  createdAt: Date;
}
