import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entities/user.entity";
import { AuthGuard, RolesGuard } from "@common/guards";
import { Roles } from "@common/decorators";
import { CurrentUser } from "@common/decorators";
import {
  ApiResponseDecorator,
  ApiArrayResponseDecorator,
} from "@common/decorators";

/**
 * 用户管理控制器
 * 提供用户管理相关接口，仅管理员可访问
 */
@ApiTags("用户管理")
@Controller("admin/users")
@UseGuards(AuthGuard, RolesGuard) // 应用认证守卫和角色守卫
@ApiBearerAuth() // Swagger文档中显示认证按钮
export class UsersAdminController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * 获取所有用户列表
   * 仅管理员可访问
   */
  @Get()
  @Roles("admin") // 指定需要admin角色才能访问
  @ApiOperation({ summary: "获取所有用户列表" })
  @ApiArrayResponseDecorator(User, "获取用户列表成功")
  async findAll() {
    return this.usersService.findAll();
  }

  /**
   * 创建新用户
   * 仅管理员可访问
   */
  @Post()
  @Roles("admin")
  @ApiOperation({ summary: "创建新用户" })
  @ApiResponseDecorator(User, "创建用户成功")
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * 删除用户
   * 仅管理员可访问
   */
  @Delete(":id")
  @Roles("admin")
  @ApiOperation({ summary: "删除用户" })
  @ApiResponseDecorator(User, "删除用户成功")
  async remove(@Param("id") id: string) {
    return this.usersService.remove(+id);
  }

  /**
   * 获取当前登录用户信息
   * 展示如何使用CurrentUser装饰器
   */
  @Get("me")
  @ApiOperation({ summary: "获取当前登录用户信息" })
  @ApiResponseDecorator(User, "获取用户信息成功")
  async getCurrentUser(@CurrentUser() user) {
    return user;
  }

  /**
   * 获取当前用户ID
   * 展示如何使用CurrentUser装饰器获取特定字段
   */
  @Get("my-id")
  @ApiOperation({ summary: "获取当前用户ID" })
  async getCurrentUserId(@CurrentUser("userId") userId: number) {
    return { userId };
  }
}
