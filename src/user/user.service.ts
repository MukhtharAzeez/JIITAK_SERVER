import { Injectable } from '@nestjs/common';
import { UserDto } from './models/user.dto';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UserEntity } from './models/post.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  signup(userDto: UserDto) {
    console.log('Hello');
  }
}
