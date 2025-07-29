import { Module } from "@nestjs/common";
import { JwtModule as NestJwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

/**
 * JWT模块
 * 提供JWT令牌的生成和验证服务
 */
@Module({
  imports: [
    NestJwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret:
          configService.get("JWT_SECRET") ||
          "your_jwt_secret_key_please_change_in_production",
        signOptions: { expiresIn: "24h" },
      }),
    }),
  ],
  exports: [NestJwtModule],
})
export class JwtModule {}
