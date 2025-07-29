import { Module } from "@nestjs/common";
import { TokenService } from "../../services/token.service";
import { RedisModule } from "../redis/redis.module";
import { JwtModule } from "../jwt/jwt.module";

/**
 * 令牌模块
 * 提供令牌验证和管理服务
 */
@Module({
  imports: [RedisModule, JwtModule],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
