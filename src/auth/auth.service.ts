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
import { Email } from 'src/lib/email/EmailTool';
import { emailType } from 'src/lib/email/config';
import { CacheService } from 'src/cache/cache.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private cacheService: CacheService,
  ) {}

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
    const accessToken = this.jwtService.sign({ userId: user.id });

    this.cacheService.set(`${email}-token`, accessToken, 7 * 24 * 60 * 60);

    return {
      accessToken,
    };
  }

  async loginOut(user: UserEntity) {
    console.log(user, 'user');
    this.cacheService.del(`${user.email}-token`);

    return '退出登录成功';
  }

  async register(
    email: string,
    password: string,
    name: string,
    phone: string,
    code: string,
  ): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({ where: { email: email } });

    if (user) {
      throw new UnauthorizedException('当前用户已存在');
    }

    const registerCode = await this.cacheService.get(
      `${email}-${emailType['register']}`,
    );

    if (+registerCode !== +code) {
      throw new UnauthorizedException('验证码不正确');
    }

    const hashedPassword = await bcrypt.hash(
      password,
      +process.env.ROUNDSOFHASHING,
    );
    const role = await this.prisma.role.findUnique({
      where: { name: 'OrdinaryUser' },
    });

    const newUser = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        role: { connect: { id: role.id } },
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

  async sendEmail(email: string, type = 'register') {
    if (type !== 'register') {
      const user = await this.prisma.user.findUnique({
        where: { email: email },
      });

      if (!user) {
        return 'email 不存在';
      }
    }

    try {
      const code = await new Email().send({
        email: email,
        subject: 'adminTemplate - 欢迎注册',
      });

      const codeType = emailType[type] || emailType['register'];

      await this.cacheService.set(`${email}-${codeType}`, code, 5 * 60);

      return code;
    } catch (error) {
      return error;
    }
  }
}
