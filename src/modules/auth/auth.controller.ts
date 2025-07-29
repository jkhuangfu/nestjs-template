import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Headers,
  HttpCode,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse as SwaggerApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { LoginResponseDto } from "./dto/login-response.dto";
import { LogoutResponseDto } from "./dto/logout-response.dto";
import { ApiResponseDecorator } from "@common/decorators";

/**
 * 认证控制器
 * 处理用户登录、登出相关接口
 */
@ApiTags("认证")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 用户登录
   */
  @Post("login")
  @HttpCode(200)
  @ApiOperation({ summary: "用户登录" })
  @ApiResponseDecorator(LoginResponseDto, "登录成功")
  @SwaggerApiResponse({ status: 401, description: "登录失败" })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  /**
   * 用户登出
   */
  @Post("logout")
  @HttpCode(200)
  @ApiOperation({ summary: "用户登出" })
  @ApiBearerAuth('authorization')
  @ApiResponseDecorator(LogoutResponseDto, "登出成功")
  async logout(@Headers("authorization") auth: string) {
    if (!auth || !auth.startsWith("Bearer ")) {
      throw new UnauthorizedException("未提供有效的认证令牌");
    }

    const token = auth.split(" ")[1];
    return this.authService.logout(token);
  }
}
