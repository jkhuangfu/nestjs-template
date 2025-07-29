import {
  Injectable,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "./auth.guard";
import { TokenService } from "../services/token.service";

/**
 * 角色守卫
 * 用于验证用户是否具有特定角色，保护需要特定角色的路由
 */
@Injectable()
export class RolesGuard extends AuthGuard {
  constructor(
    private reflector: Reflector,
    tokenService: TokenService,
  ) {
    super(tokenService);
  }

  /**
   * 验证请求是否有权限访问
   * @param context 执行上下文
   * @returns 是否有权限访问
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 首先验证用户是否已登录
    const isAuthenticated = await super.canActivate(context);
    if (!isAuthenticated) {
      return false;
    }

    // 获取路由所需的角色
    const requiredRoles = this.reflector.get<string[]>(
      "roles",
      context.getHandler(),
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // 如果没有指定角色要求，则允许访问
    }

    // 获取用户信息
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // 验证用户是否具有所需角色
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException("您没有权限执行此操作");
    }

    return true;
  }
}
