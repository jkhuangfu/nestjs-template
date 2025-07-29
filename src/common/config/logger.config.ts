import { WinstonModuleOptions } from "nest-winston";
import * as winston from "winston";
import { utilities as nestWinstonModuleUtilities } from "nest-winston";
import * as path from "path";
import "winston-daily-rotate-file";

/**
 * 日志级别
 */
export enum LogLevel {
  ERROR = "error",
  WARN = "warn",
  INFO = "info",
  HTTP = "http",
  VERBOSE = "verbose",
  DEBUG = "debug",
  SILLY = "silly",
}

/**
 * 日志配置
 */
export const loggerConfig: WinstonModuleOptions = {
  transports: [
    // 控制台日志
    new winston.transports.Console({
      level: LogLevel.DEBUG, // 设置为DEBUG级别，将记录DEBUG及以上级别的日志
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        nestWinstonModuleUtilities.format.nestLike("nestjs-services", {
          colors: true,
          prettyPrint: true,
        }),
      ),
    }),
    // 信息日志文件（带轮转）
    new winston.transports.DailyRotateFile({
      dirname: path.join(process.cwd(), "logs"),
      filename: "application-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m", // 单个文件最大20MB
      maxFiles: "14d", // 保留14天的日志
      level: LogLevel.DEBUG, // 使用DEBUG级别，将记录所有DEBUG及以上级别的日志
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
    // 错误日志文件（带轮转）
    new winston.transports.DailyRotateFile({
      dirname: path.join(process.cwd(), "logs"),
      filename: "error-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m", // 单个文件最大20MB
      maxFiles: "30d", // 保留30天的错误日志
      level: LogLevel.ERROR,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
};
