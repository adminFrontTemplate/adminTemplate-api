//src/auth/auth.service.ts
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entity/auth.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { EmailNotFound } from 'src/type/auth';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async login(email: string, password: string): Promise<AuthEntity> {
    // Step 1: Fetch a user with the given email
    const user = await this.prisma.user.findUnique({ where: { email: email } });

    // If no user is found, throw an error
    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    // Step 2: Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If password does not match, throw an error
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    // Step 3: Generate a JWT token containing the user's ID and return it
    return {
      accessToken: this.jwtService.sign({ userId: user.id }),
    };
  }

  async register(
    email: string,
    password: string,
    name: string,
    phone: string,
  ): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({ where: { email: email } });

    if (user) {
      throw new UnauthorizedException('当前用户已存在');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
      },
    });

    return newUser;
  }

  async emailFindUser(email: string): Promise<UserEntity | EmailNotFound> {
    const user = await this.prisma.user.findUnique({ where: { email: email } });

    if (user) {
      return user;
    }

    return {
      message: 'user not found',
    };
  }
}
