import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersModule } from "../users/users.module";
import { TokenModule } from "@common/modules/token/token.module";
import { GuardsModule } from "@common/modules/guards/guards.module";

/**
 * 认证模块
 * 处理用户登录、登出和会话管理
 */
@Module({
  imports: [
    UsersModule,
    TokenModule,
    GuardsModule, // 导入守卫模块，以便在控制器中使用守卫
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
