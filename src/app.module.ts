import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CacheModule } from './cache/cache.module';
import { RoleModule } from './role/role.module';
import { TransformInterceptor } from 'src/lib/interceptor/transform.interceptor';
import { ErrorFilter } from 'src/lib/filters/error.filter';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, CacheModule, RoleModule],
  controllers: [AppController],
  providers: [
    AppService,
    // 全局异常过滤器
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
    // 全局拦截器处理
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
