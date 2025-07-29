import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { AuthGuard, RolesGuard } from "@common/guards";
import { Roles, CurrentUser } from "@common/decorators";
import { ApiResponseDecorator } from "@common/decorators";
import { AuthUser } from "@common/interfaces/auth-user.interface";

/**
 * 认证示例控制器
 * 展示如何使用认证守卫、角色守卫和相关装饰器
 */
@ApiTags("认证示例")
@Controller("auth-examples")
@ApiBearerAuth() // Swagger文档中显示认证按钮
export class AuthExampleController {
  /**
   * 需要登录的接口示例
   * 任何已登录用户都可以访问
   */
  @Get("authenticated")
  @UseGuards(AuthGuard) // 只应用认证守卫，不检查角色
  @ApiOperation({ summary: "需要登录的接口示例" })
  @ApiResponseDecorator(Object, "获取成功")
  async authenticatedEndpoint(@CurrentUser() user: AuthUser) {
    return {
      message: "您已成功通过认证",
      user: {
        userId: user.userId,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }

  /**
   * 需要管理员角色的接口示例
   * 只有管理员可以访问
   */
  @Get("admin-only")
  @UseGuards(AuthGuard, RolesGuard) // 应用认证守卫和角色守卫
  @Roles("admin") // 指定需要admin角色才能访问
  @ApiOperation({ summary: "需要管理员角色的接口示例" })
  @ApiResponseDecorator(Object, "获取成功")
  async adminOnlyEndpoint(@CurrentUser() user: AuthUser) {
    return {
      message: "您已成功通过管理员权限验证",
      user: {
        userId: user.userId,
        username: user.username,
        role: user.role,
      },
    };
  }

  /**
   * 需要特定角色的接口示例
   * 管理员或编辑可以访问
   */
  @Get("admin-or-editor")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles("admin", "editor") // 指定需要admin或editor角色才能访问
  @ApiOperation({ summary: "需要管理员或编辑角色的接口示例" })
  @ApiResponseDecorator(Object, "获取成功")
  async adminOrEditorEndpoint(@CurrentUser("role") role: string) {
    return {
      message: `您以${role}角色成功访问此接口`,
      accessTime: new Date(),
    };
  }

  /**
   * 获取当前用户特定信息的示例
   * 任何已登录用户都可以访问
   */
  @Get("user-info")
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "获取当前用户特定信息的示例" })
  @ApiResponseDecorator(Object, "获取成功")
  async getUserInfo(
    @CurrentUser("userId") userId: number,
    @CurrentUser("email") email: string,
  ) {
    return {
      userId,
      email,
      requestTime: new Date(),
    };
  }
}
