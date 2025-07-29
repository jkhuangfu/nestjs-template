import { Injectable, UnauthorizedException, Logger } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { LoginDto } from "./dto/login.dto";
import * as bcrypt from "bcrypt";
import { TokenService } from "@common/services/token.service";

/**
 * 认证服务
 * 处理用户登录、登出和会话管理
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  /**
   * 用户登录
   * @param loginDto 登录信息
   * @returns 登录成功的用户信息和令牌
   */
  async login(loginDto: LoginDto) {
    // 查找用户
    const user = await this.usersService.findByEmail(loginDto.email);

    // 验证密码
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException("邮箱或密码不正确");
    }

    // 创建会话数据
    const payload = {
      sub: user.id, // JWT标准字段，表示主题（通常是用户ID）
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      iat: Math.floor(Date.now() / 1000), // 签发时间
    };

    // 使用令牌服务生成JWT令牌
    const token = this.tokenService.generateToken(payload);

    this.logger.log(`用户 ${user.email} 登录成功`);

    // 返回用户信息和令牌
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      expiresIn: this.tokenService.TOKEN_TTL,
    };
  }

  /**
   * 用户登出
   * @param token 会话令牌
   */
  async logout(token: string) {
    // 使用令牌服务撤销令牌
    await this.tokenService.revokeToken(token);

    return { message: "登出成功" };
  }
}
