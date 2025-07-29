import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

/**
 * 登录数据传输对象
 */
export class LoginDto {
  @ApiProperty({ description: "用户邮箱" })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: "用户密码" })
  @IsString()
  @IsNotEmpty()
  password: string;
}
