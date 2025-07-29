import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { InjectRedis } from "@nestjs-modules/ioredis";
import Redis from "ioredis";

/**
 * Redis服务
 * 提供Redis操作的封装方法
 */
@Injectable()
export class RedisService implements OnModuleInit {
  private readonly logger = new Logger(RedisService.name);

  constructor(@InjectRedis() private readonly redis: Redis) {}

  async onModuleInit() {
    try {
      // 测试连接
      await this.ping();
      this.logger.log("Redis连接成功");
    } catch (error) {
      this.logger.error(`Redis连接失败: ${error.message}`);
    }
  }

  /**
   * 测试Redis连接
   */
  async ping(): Promise<string> {
    return await this.redis.ping();
  }

  /**
   * 设置键值对
   * @param key 键
   * @param value 值
   * @param ttl 过期时间（秒）
   */
  async set(key: string, value: any, ttl?: number): Promise<"OK"> {
    const stringValue =
      typeof value === "object" ? JSON.stringify(value) : String(value);

    if (ttl) {
      return await this.redis.set(key, stringValue, "EX", ttl);
    }

    return await this.redis.set(key, stringValue);
  }

  /**
   * 获取值
   * @param key 键
   */
  async get(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }

  /**
   * 获取JSON值
   * @param key 键
   */
  async getJSON<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);
    if (!value) return null;

    try {
      return JSON.parse(value) as T;
    } catch (e) {
      this.logger.error(`解析JSON失败: ${e.message}`);
      return null;
    }
  }

  /**
   * 删除键
   * @param key 键或键数组
   */
  async del(...keys: string[]): Promise<number> {
    return await this.redis.del(keys);
  }

  /**
   * 设置过期时间
   * @param key 键
   * @param seconds 秒数
   */
  async expire(key: string, seconds: number): Promise<number> {
    return await this.redis.expire(key, seconds);
  }

  /**
   * 检查键是否存在
   * @param key 键或键数组
   */
  async exists(...keys: string[]): Promise<number> {
    return await this.redis.exists(keys);
  }

  /**
   * 获取所有匹配的键
   * @param pattern 模式
   */
  async keys(pattern: string): Promise<string[]> {
    return await this.redis.keys(pattern);
  }

  /**
   * 哈希表设置字段值
   * @param key 哈希表键
   * @param field 字段
   * @param value 值
   */
  async hset(key: string, field: string, value: any): Promise<number> {
    const stringValue =
      typeof value === "object" ? JSON.stringify(value) : String(value);
    return await this.redis.hset(key, field, stringValue);
  }

  /**
   * 哈希表获取字段值
   * @param key 哈希表键
   * @param field 字段
   */
  async hget(key: string, field: string): Promise<string | null> {
    return await this.redis.hget(key, field);
  }

  /**
   * 哈希表获取JSON字段值
   * @param key 哈希表键
   * @param field 字段
   */
  async hgetJSON<T>(key: string, field: string): Promise<T | null> {
    const value = await this.redis.hget(key, field);
    if (!value) return null;

    try {
      return JSON.parse(value) as T;
    } catch (e) {
      this.logger.error(`解析JSON失败: ${e.message}`);
      return null;
    }
  }

  /**
   * 哈希表获取所有字段值
   * @param key 哈希表键
   */
  async hgetall(key: string): Promise<Record<string, string>> {
    return await this.redis.hgetall(key);
  }

  /**
   * 列表左侧推入元素
   * @param key 列表键
   * @param values 值
   */
  async lpush(key: string, ...values: any[]): Promise<number> {
    const stringValues = values.map((value) =>
      typeof value === "object" ? JSON.stringify(value) : String(value),
    );
    return await this.redis.lpush(key, ...stringValues);
  }

  /**
   * 列表右侧推入元素
   * @param key 列表键
   * @param values 值
   */
  async rpush(key: string, ...values: any[]): Promise<number> {
    const stringValues = values.map((value) =>
      typeof value === "object" ? JSON.stringify(value) : String(value),
    );
    return await this.redis.rpush(key, ...stringValues);
  }

  /**
   * 列表左侧弹出元素
   * @param key 列表键
   */
  async lpop(key: string): Promise<string | null> {
    return await this.redis.lpop(key);
  }

  /**
   * 列表右侧弹出元素
   * @param key 列表键
   */
  async rpop(key: string): Promise<string | null> {
    return await this.redis.rpop(key);
  }

  /**
   * 获取列表指定范围的元素
   * @param key 列表键
   * @param start 开始索引
   * @param stop 结束索引
   */
  async lrange(key: string, start: number, stop: number): Promise<string[]> {
    return await this.redis.lrange(key, start, stop);
  }

  /**
   * 发布消息到频道
   * @param channel 频道
   * @param message 消息
   */
  async publish(channel: string, message: any): Promise<number> {
    const stringMessage =
      typeof message === "object" ? JSON.stringify(message) : String(message);
    return await this.redis.publish(channel, stringMessage);
  }

  /**
   * 订阅频道
   * @param channels 频道
   * @param callback 回调函数
   */
  async subscribe(
    channels: string | string[],
    callback: (channel: string, message: string) => void,
  ): Promise<void> {
    await this.redis.subscribe(...[].concat(channels as any));
    this.redis.on("message", callback);
  }

  /**
   * 取消订阅频道
   * @param channels 频道
   */
  async unsubscribe(...channels: string[]): Promise<void> {
    await this.redis.unsubscribe(...channels);
  }

  /**
   * 获取Redis客户端实例
   * 用于直接访问Redis客户端的高级功能
   */
  getClient(): Redis {
    return this.redis;
  }
}
