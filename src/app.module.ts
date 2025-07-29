import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "@modules/users/users.module";
import { AuthModule } from "@modules/auth/auth.module";
import { databaseConfig } from "@config/database.config";
import { LoggerModule } from "@common/modules/logger/logger.module";
import { RedisModule } from "@common/modules/redis/redis.module";
import { TokenModule } from "@common/modules/token/token.module";
import { GuardsModule } from "@common/modules/guards/guards.module";
import { LoggerMiddleware } from "@common/middleware/logger.middleware";
import { RequestIdMiddleware } from "@common/middleware/request-id.middleware";

/**
 * 应用程序主模块
 * 导入所有功能模块和全局配置
 */
@Module({
  imports: [
    // 全局配置模块
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // 日志模块
    LoggerModule,
    // 数据库连接模块
    TypeOrmModule.forRoot(databaseConfig),
    // Redis缓存模块
    RedisModule,
    TokenModule,
    GuardsModule,
    // 功能模块
    UsersModule,
    AuthModule,
  ],
})
export class AppModule implements NestModule {
  /**
   * 配置中间件
   * @param consumer 中间件消费者
   */
  configure(consumer: MiddlewareConsumer) {
    // 为所有路由注册中间件，先添加请求ID，再记录日志
    consumer.apply(RequestIdMiddleware, LoggerMiddleware).forRoutes("*");
  }
}
