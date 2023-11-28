import {
  Injectable,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const newData = this.transformData(data);
        return {
          data: newData,
          statusCode: 200,
          message: '请求成功',
        };
      }),
    );
  }

  private transformData(data: any): any {
    if (data instanceof Object) {
      // 移除密码字段
      if ('password' in data) {
        delete data.password;
      }

      // 递归处理嵌套对象
      for (const key in data) {
        if (data[key] instanceof Object) {
          data[key] = this.transformData(data[key]);
        }
      }
    }
    return data;
  }
}
