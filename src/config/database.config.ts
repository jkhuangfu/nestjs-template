import { TypeOrmModuleOptions } from "@nestjs/typeorm";

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
  // 启用查询和错误日志记录
  logging: ["query", "error"],
  // 连接超时和查询超时设置
  extra: {
    connectionTimeoutMillis: 5000,
    query_timeout: 5000,
  },
  connectTimeoutMS: 5000,
};
