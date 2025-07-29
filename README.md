# NestJS项目模板说明

一个基于 NestJS 框架构建的现代化后端 API，提供完整的用户认证、权限管理和 RESTful 接口。

## 🚀 项目特性

- **现代化架构**: 基于 NestJS 框架，采用 TypeScript 开发
- **数据库支持**: 使用 TypeORM + PostgreSQL 进行数据持久化
- **缓存系统**: 集成 Redis 缓存提升性能
- **认证授权**: JWT Token 认证 + 基于角色的权限控制 (RBAC)
- **API 文档**: 集成 Swagger/OpenAPI 3.0 + Knife4j 文档界面
- **日志系统**: Winston 日志记录，支持文件轮转
- **数据验证**: 使用 class-validator 进行请求数据验证
- **全局异常处理**: 统一的错误处理和响应格式
- **性能监控**: API 性能拦截器
- **开发工具**: ESLint + Prettier 代码规范

## 📁 项目结构

```
src/
├── app.module.ts              # 应用主模块
├── main.ts                    # 应用入口文件
├── common/                    # 公共模块
│   ├── config/               # 配置文件
│   │   ├── logger.config.ts  # 日志配置
│   │   └── redis.config.ts   # Redis配置
│   ├── decorators/           # 自定义装饰器
│   │   ├── api-response.decorator.ts  # API响应装饰器
│   │   ├── current-user.decorator.ts  # 当前用户装饰器
│   │   └── roles.decorator.ts         # 角色权限装饰器
│   ├── filters/              # 异常过滤器
│   │   ├── http-exception.filter.ts   # HTTP异常过滤器
│   │   └── validation.filter.ts       # 验证异常过滤器
│   ├── guards/               # 守卫
│   │   ├── auth.guard.ts     # 认证守卫
│   │   └── roles.guard.ts    # 角色权限守卫
│   ├── interceptors/         # 拦截器
│   │   ├── response.interceptor.ts    # 响应拦截器
│   │   └── api-performance.interceptor.ts  # 性能监控拦截器
│   ├── interfaces/           # 接口定义
│   ├── middleware/           # 中间件
│   │   ├── logger.middleware.ts       # 日志中间件
│   │   └── request-id.middleware.ts   # 请求ID中间件
│   ├── modules/              # 公共功能模块
│   │   ├── guards/           # 守卫模块
│   │   ├── jwt/              # JWT模块
│   │   ├── logger/           # 日志模块
│   │   ├── redis/            # Redis模块
│   │   └── token/            # Token模块
│   └── services/             # 公共服务
├── config/                   # 应用配置
│   └── database.config.ts    # 数据库配置
└── modules/                  # 业务模块
    ├── auth/                 # 认证模块
    │   ├── auth.controller.ts    # 认证控制器
    │   ├── auth.service.ts       # 认证服务
    │   ├── auth.module.ts        # 认证模块
    │   └── dto/                  # 数据传输对象
    └── users/                # 用户模块
        ├── users.controller.ts       # 用户控制器
        ├── users.service.ts          # 用户服务
        ├── users.module.ts           # 用户模块
        ├── dto/                      # 数据传输对象
        └── entities/                 # 实体定义
```

## 🛠️ 技术栈

### 核心框架
- **NestJS**: Node.js 服务端框架
- **TypeScript**: 类型安全的 JavaScript 超集
- **Express**: HTTP 服务器框架

### 数据库 & 缓存
- **PostgreSQL**: 关系型数据库
- **TypeORM**: ORM 框架
- **Redis**: 内存数据库，用于缓存和会话存储

### 认证 & 安全
- **JWT**: JSON Web Token 认证
- **bcrypt**: 密码加密
- **class-validator**: 数据验证
- **class-transformer**: 数据转换

### 文档 & 工具
- **Swagger/OpenAPI**: API 文档生成
- **Knife4j**: 增强版 Swagger UI
- **Winston**: 日志记录
- **ESLint**: 代码检查
- **Prettier**: 代码格式化

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- PostgreSQL >= 12.0
- Redis >= 6.0
- pnpm (推荐) 或 npm

### 安装依赖

```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install
```

### 环境配置


1. 配置环境变量：
```env
# 数据库配置
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=db_name

# Redis配置
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# JWT配置
JWT_SECRET=your_jwt_secret_key

# 应用配置
PORT=3001
NODE_ENV=development
```


### 启动应用

```bash
# 开发模式
npm run start

# 监听模式（推荐开发使用）
npm run start:dev

# 调试模式
npm run start:debug

# 生产模式
npm run start:prod
```

应用启动后，访问以下地址：

- **API 服务**: http://localhost:3000
- **Swagger 文档**: http://localhost:3000/api
- **Knife4j 文档**: http://localhost:3000/doc.html


## 🔧 开发指南

### 代码规范

项目使用 ESLint 和 Prettier 进行代码规范管理：

```bash
# 检查代码规范
npm run lint

# 自动修复代码格式
npm run fix

# 严格模式修复（零警告）
npm run fix:strict
```

### 日志系统

应用集成了 Winston 日志系统，支持：

- 控制台输出（开发环境）
- 文件记录（生产环境）
- 日志轮转（按日期分割）
- 不同级别的日志记录

日志文件位置：`logs/` 目录

### 数据验证

使用 `class-validator` 进行请求数据验证：

```typescript
import { IsString, IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
```

### 权限控制

基于角色的权限控制 (RBAC)：

```typescript
@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class UsersController {
  @Get()
  @Roles('admin')  // 只有管理员可以访问
  findAll() {
    // ...
  }
}
```


## 📝 更新日志

### v0.0.1 (当前版本)
- ✅ 基础项目架构搭建
- ✅ 用户认证系统
- ✅ 权限管理系统
- ✅ API 文档集成
- ✅ 日志系统集成
- ✅ 数据库连接配置
- ✅ Redis 缓存集成
