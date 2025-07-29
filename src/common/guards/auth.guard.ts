import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from "@nestjs/common";
import { TokenService } from "../services/token.service";

/**
 * 认证守卫
 * 用于验证请求中的令牌，保护需要登录的路由
 */
@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);
  constructor(private readonly tokenService: TokenService) {}

  /**
   * 验证请求是否有权限访问
   * @param context 执行上下文
   * @returns 是否有权限访问
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException("未提供有效的认证令牌");
    }

    const token = authHeader.split(" ")[1];
    const userData = await this.tokenService.validateToken(token);

    if (!userData) {
      throw new UnauthorizedException("认证令牌无效或已过期");
    }

    // 将用户信息添加到请求对象中
    request.user = userData;

    // 注意：使用JWT时，我们不需要每次请求都刷新令牌
    // 如果需要实现令牌刷新，可以在令牌即将过期时才刷新

    return true;
  }
}
