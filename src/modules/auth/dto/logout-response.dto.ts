import { ApiProperty } from "@nestjs/swagger";

/**
 * 登出响应数据传输对象
 */
export class LogoutResponseDto {
  @ApiProperty({ description: "响应消息", example: "登出成功" })
  message: string;
}
