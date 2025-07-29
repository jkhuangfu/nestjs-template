import { Module } from "@nestjs/common";
import { WinstonModule } from "nest-winston";
import { loggerConfig } from "@common/config/logger.config";

/**
 * 日志模块
 * 提供全局日志服务
 */
@Module({
  imports: [WinstonModule.forRoot(loggerConfig)],
  exports: [WinstonModule],
})
export class LoggerModule {}
