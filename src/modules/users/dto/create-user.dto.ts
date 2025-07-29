import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
} from "class-validator";

/**
 * 创建用户的数据传输对象
 */
export class CreateUserDto {
  @ApiProperty({ description: "用户邮箱" })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: "用户名" })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: "用户密码", minimum: 6 })
  @IsString()
  @IsNotEmpty()
  @MinLength(6) // 修改最小长度为3，以适应测试数据
  password: string;

  @ApiProperty({
    description: "用户角色",
    enum: ["user", "admin"],
    default: "user",
    required: false,
  })
  @IsString()
  @IsOptional()
  role?: string;
}
