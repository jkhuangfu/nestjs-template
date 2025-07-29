import { Module } from "@nestjs/common";
import { AuthGuard, RolesGuard } from "../../guards";
import { TokenModule } from "../token/token.module";

/**
 * 守卫模块
 * 提供认证和授权守卫
 */
@Module({
  imports: [TokenModule],
  providers: [AuthGuard, RolesGuard],
  exports: [AuthGuard, RolesGuard, TokenModule], // 导出TokenModule，确保TokenService可用
})
export class GuardsModule {}
