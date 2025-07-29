import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Logger,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserResponseDto } from "./dto/user-response.dto";
import {
  ApiResponseDecorator,
  ApiArrayResponseDecorator,
  CurrentUser,
  Roles,
} from "@common/decorators";
import { AuthUser } from "@/common/interfaces/auth-user.interface";
import { AuthGuard, RolesGuard } from "@/common/guards";

@ApiTags("用户")
@Controller("users")
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  private logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: "创建新用户" })
  @ApiResponseDecorator(UserResponseDto, "用户创建成功")
  @ApiResponse({ status: 400, description: "请求参数错误" })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: "获取所有用户(管理员拥有权限)" })
  @ApiArrayResponseDecorator(UserResponseDto, "返回所有用户")
  @Roles("admin")
  findAll(@CurrentUser() user: AuthUser) {
    this.logger.log(`Current user: ${user.username}`);
    return this.usersService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "根据ID获取用户" })
  @ApiResponseDecorator(UserResponseDto, "返回指定用户")
  @ApiResponse({ status: 404, description: "用户未找到" })
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(+id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "删除用户" })
  @ApiResponse({ status: 200, description: "用户删除成功" })
  @ApiResponse({ status: 404, description: "用户未找到" })
  @Roles("admin")
  remove(@Param("id") id: string) {
    return this.usersService.remove(+id);
  }
}
