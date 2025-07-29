import { ApiProperty } from "@nestjs/swagger";

/**
 * 用户响应DTO
 * 不包含关联的文章和评论信息
 */
export class UserResponseDto {
  @ApiProperty({ description: "用户的唯一标识符" })
  id: number;

  @ApiProperty({ description: "用户的电子邮箱" })
  email: string;

  @ApiProperty({ description: "用户名" })
  username: string;

  @ApiProperty({ description: "用户角色", enum: ["user", "admin"] })
  role: string;

  @ApiProperty({ description: "用户创建日期" })
  createdAt: Date;

  @ApiProperty({ description: "用户最后更新日期" })
  updatedAt: Date;
}
