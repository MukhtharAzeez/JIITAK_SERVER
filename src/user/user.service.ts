import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserDto } from './models/user.dto';
import { Repository } from 'typeorm';
import { UserEntity } from './models/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { UpdatePasswordDto } from './models/updatePassword.dto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async signup(userDto: UserDto): Promise<UserEntity> {
    const userExists = await this.userRepository.findOne({
      where: { email: userDto.email },
    });
    if (userExists) {
      throw new HttpException(
        'User already exists with this email',
        HttpStatus.BAD_REQUEST,
      );
    }
    userDto.password = await argon2.hash(userDto.password);
    return this.userRepository.save(userDto);
  }

  async login(userDto: UserDto) {
    const checkUser = await this.userRepository.findOne({
      where: { email: userDto.email },
    });
    if (checkUser) {
      const passwordCheck = await argon2.verify(
        checkUser.password,
        userDto.password,
      );
      if (passwordCheck) {
        return checkUser;
      } else {
        throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
      }
    } else {
      throw new HttpException(
        'You do not have an account',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateProfile(id: number, email: string, username: string) {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .update(UserEntity)
      .set({ email, username })
      .where('id = :id', { id })
      .returning('*');
    const result = await queryBuilder.execute();
    return result.raw[0];
  }

  async updatePassword(id: number, updatePasswordDto: UpdatePasswordDto) {
    const checkUser = await this.userRepository.findOne({
      where: { id: id },
    });
    if (checkUser) {
      const passwordCheck = await argon2.verify(
        checkUser.password,
        updatePasswordDto.oldPassword,
      );

      if (!passwordCheck) {
        throw new HttpException(
          'Old password is wrong',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        const password = await argon2.hash(updatePasswordDto.newPassword);

        const queryBuilder = this.userRepository
          .createQueryBuilder('user')
          .update(UserEntity)
          .set({ password })
          .where('id = :id', { id })
          .returning('*');
        const result = await queryBuilder.execute();
        return result.raw[0];
      }
    } else {
      return null;
    }
  }

  async forgotPassword(email: string, newPassword: string) {
    const password = await argon2.hash(newPassword);

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .update(UserEntity)
      .set({ password })
      .where('email = :email', { email })
      .returning('*');
    const result = await queryBuilder.execute();
    return result.raw[0];
  }

  async sendEmail(email: string, otp: number) {
    try {
      const checkUser = await this.userRepository.findOne({
        where: { email: email },
      });
      if (!checkUser) {
        return false;
      }
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'mukhtharazeez28@gmail.com',
          pass: 'nlwvbqnasvkjssqc',
        },
      });

      const mailOptions = {
        from: 'mukhtharazeez28@gmail.com',
        to: email,
        subject: 'OTP to change password',
        text: `Hello, this is from the web application ,${otp} is your One Time Password enter this OTP to reset your password!`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          throw new HttpException(
            'something went wrong ',
            HttpStatus.FORBIDDEN,
          );
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      return otp;
    } catch (error) {
      console.log(error);
    }
  }
}
