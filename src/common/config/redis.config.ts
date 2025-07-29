import { RedisModuleOptions } from "@nestjs-modules/ioredis";

/**
 * Redis配置
 */
export const redisConfig: RedisModuleOptions = {
  type: "single",
  options: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
    password: process.env.REDIS_PASSWORD || undefined,
    db: parseInt(process.env.REDIS_DB || "0"),
    // 连接超时时间（毫秒）
    connectTimeout: 10000,
    // 重试策略
    retryStrategy: (times) => {
      // 最多重试5次，每次间隔时间为 times * 1000 毫秒
      return times > 5 ? null : times * 1000;
    },
  },
};
