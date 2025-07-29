import { ApiProperty } from "@nestjs/swagger";

/**
 * 用户信息DTO
 */
class UserInfoDto {
  @ApiProperty({ description: "用户ID" })
  id: number;

  @ApiProperty({ description: "用户邮箱" })
  email: string;

  @ApiProperty({ description: "用户名" })
  username: string;

  @ApiProperty({ description: "用户角色", enum: ["user", "admin"] })
  role: string;
}

/**
 * 登录响应数据传输对象
 */
export class LoginResponseDto {
  @ApiProperty({ description: "认证令牌" })
  token: string;

  @ApiProperty({ description: "用户信息" })
  user: UserInfoDto;

  @ApiProperty({ description: "令牌有效期（秒）" })
  expiresIn: number;
}
