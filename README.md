## Admin-BackEnd

一个简单的后端REST API，使用NestJS, Prisma, PostgreSQL, Swagger, JWT, Redis构建

### Installation

1. 安装依赖(推荐node 18+) 
    
    `npm install`
2. 启动PostgreSQL数据库(如果你有一个PostgreSQL的本地实例在运行，你可以跳过这一步。在这种情况下，您需要更改.env 中的' DATABASE_URL', 参考:[PostgreSQL connection string](https://www.prisma.io/docs/concepts/database-connectors/postgresql#connection-details))
   
    `docker-compose up -d`

3. 迁移数据库

    `npx prisma migrate dev` 

4. 执行seed
    `npx prisma db seed`

5. 启动应用
    `npm run start:dev`

6. 访问API文档
    http://localhost:3000/apidoc


### 功能介绍

1. 登录
2. 注册
3. 忘记密码
4. 个人用户
5. 角色自定义权限等
5. email验证
6. redis缓存
7. JWT
