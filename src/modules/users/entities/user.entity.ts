import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiProperty, ApiHideProperty } from "@nestjs/swagger";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: "用户的唯一标识符" })
  id: number;

  @Column({ unique: true })
  @ApiProperty({ description: "用户的电子邮箱" })
  email: string;

  @Column()
  @ApiProperty({ description: "用户名" })
  username: string;

  @Column()
  @ApiHideProperty()
  password: string;

  @Column({ default: "user" })
  @ApiProperty({ description: "用户角色", enum: ["user", "admin"] })
  role: string;

  @CreateDateColumn()
  @ApiProperty({ description: "用户创建日期" })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: "用户最后更新日期" })
  updatedAt: Date;
}
