import { Injectable, Logger } from "@nestjs/common";
import { RedisService } from "../modules/redis/redis.service";
import { JwtService } from "@nestjs/jwt";

/**
 * 令牌服务
 * 用于验证和管理令牌，与具体业务逻辑解耦
 */
@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);
  // 令牌有效期（秒）
  public readonly TOKEN_TTL = 86400; // 24小时

  constructor(
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 验证令牌
   * @param token 令牌
   * @returns 令牌关联的数据
   */
  async validateToken(token: string): Promise<any> {
    if (!token) {
      return null;
    }

    try {
      // 验证JWT令牌
      const decoded = this.jwtService.verify(token);

      // 检查令牌是否被撤销
      const isRevoked = await this.redisService.get(`auth:revoked:${token}`);
      if (isRevoked) {
        return null;
      }

      return decoded;
    } catch (error) {
      this.logger.error(`令牌验证失败: ${error.message}`);
      return null;
    }
  }

  /**
   * 刷新令牌有效期
   * @param token 令牌
   */
  async refreshToken(token: string): Promise<string | null> {
    try {
      // 验证当前令牌
      const decoded = await this.validateToken(token);
      if (!decoded) {
        return null;
      }

      // 创建新令牌
      const newToken = this.generateToken(decoded);

      // 撤销旧令牌
      await this.revokeToken(token);

      return newToken;
    } catch (error) {
      this.logger.error(`刷新令牌失败: ${error.message}`);
      return null;
    }
  }

  /**
   * 创建令牌
   * @param data 要存储在令牌中的数据
   * @returns 生成的JWT令牌
   */
  generateToken(data: any): string {
    // 生成JWT令牌
    return this.jwtService.sign(data, { expiresIn: this.TOKEN_TTL });
  }

  /**
   * 撤销令牌
   * @param token 令牌
   */
  async revokeToken(token: string): Promise<void> {
    try {
      // 将令牌添加到撤销列表
      const decoded = this.jwtService.decode(token) as { exp: number };
      if (decoded && decoded.exp) {
        // 计算令牌的剩余有效期
        const now = Math.floor(Date.now() / 1000);
        const ttl = decoded.exp - now;

        if (ttl > 0) {
          // 将令牌标记为已撤销，直到其原始过期时间
          await this.redisService.set(`auth:revoked:${token}`, "1", ttl);
          this.logger.log(`令牌 ${token.substring(0, 10)}... 已撤销`);
        }
      }
    } catch (error) {
      this.logger.error(`撤销令牌失败: ${error.message}`);
    }
  }
}
