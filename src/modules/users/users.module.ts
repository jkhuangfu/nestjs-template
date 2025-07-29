import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { User } from "./entities/user.entity";
import { GuardsModule } from "@common/modules/guards/guards.module";

/**
 * 用户模块
 * 包含用户相关的控制器、服务和实体
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    GuardsModule, // 导入守卫模块，以便在控制器中使用守卫
  ],
  controllers: [UsersController], 
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
