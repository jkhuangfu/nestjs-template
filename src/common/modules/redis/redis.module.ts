import { Module, Global } from "@nestjs/common";
import { RedisModule as NestRedisModule } from "@nestjs-modules/ioredis";
import { redisConfig } from "@common/config/redis.config";
import { RedisService } from "./redis.service";

/**
 * Redis模块
 * 提供Redis连接和操作服务
 */
@Global()
@Module({
  imports: [NestRedisModule.forRoot(redisConfig)],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
