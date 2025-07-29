import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { join } from "path";

/**
 * 数据库配置
 * 从环境变量中读取数据库连接信息
 */
export const databaseConfig: TypeOrmModuleOptions = {
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_DATABASE || "postgres",
  // 使用autoLoadEntities而不是手动指定实体路径
  autoLoadEntities: true,
  synchronize: process.env.NODE_ENV !== "production",
};
