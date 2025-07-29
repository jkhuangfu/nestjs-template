import { Injectable, NestMiddleware, Logger } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

/**
 * 请求日志中间件
 * 记录所有进入应用的HTTP请求信息
 */
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger("HttpRequest");

  /**
   * 处理请求并记录日志
   * @param request 请求对象
   * @param response 响应对象
   * @param next 下一个中间件函数
   */
  use(request: Request, response: Response, next: NextFunction): void {
    // 获取请求开始时间
    const { method, originalUrl, ip, body, query, params } = request;
    const userAgent = request.get("user-agent") || "";
    const startTime = Date.now();

    // 获取请求ID
    const requestId = request["requestId"] || "unknown";

    // 记录请求信息
    this.logger.log(
      `[${requestId}] 收到请求 ${method} ${originalUrl} - IP: ${ip} - UserAgent: ${userAgent}`,
    );

    // 记录请求详细信息
    const requestInfo = {
      requestId,
      method,
      url: originalUrl,
      ip,
      userAgent,
      timestamp: new Date().toISOString(),
    };

    // 记录请求体（如果存在）
    if (body && Object.keys(body).length > 0) {
      requestInfo["body"] = this.sanitizeData(body);
      this.logger.log(
        `[${requestId}] 请求体: ${JSON.stringify(this.sanitizeData(body))}`,
      );
    }

    // 记录查询参数（如果存在）
    if (query && Object.keys(query).length > 0) {
      requestInfo["query"] = query;
      this.logger.log(`[${requestId}] 查询参数: ${JSON.stringify(query)}`);
    }

    // 记录路径参数（如果存在）
    if (params && Object.keys(params).length > 0) {
      requestInfo["params"] = params;
      this.logger.log(`[${requestId}] 路径参数: ${JSON.stringify(params)}`);
    }

    // 将请求信息存储在请求对象中，以便在响应拦截器中使用
    request["requestInfo"] = requestInfo;

    // 监听响应完成事件
    response.on("finish", () => {
      // 计算请求处理时间
      const responseTime = Date.now() - startTime;
      const { statusCode } = response;

      // 根据状态码选择日志级别
      if (statusCode >= 500) {
        this.logger.error(
          `[${requestId}] 响应请求 ${method} ${originalUrl} ${statusCode} ${responseTime}ms`,
        );
      } else if (statusCode >= 400) {
        this.logger.warn(
          `[${requestId}] 响应请求 ${method} ${originalUrl} ${statusCode} ${responseTime}ms`,
        );
      } else {
        this.logger.log(
          `[${requestId}] 响应请求 ${method} ${originalUrl} ${statusCode} ${responseTime}ms`,
        );
      }
    });

    next();
  }

  /**
   * 清理敏感数据
   * @param data 需要清理的数据
   * @returns 清理后的数据
   */
  private sanitizeData(data: any): any {
    if (!data) return data;

    // 创建数据的深拷贝
    const sanitized = JSON.parse(JSON.stringify(data));

    // 清理敏感字段
    const sensitiveFields = [
      "password",
      "passwordConfirm",
      "token",
      "secret",
      "authorization",
    ];

    // 递归清理对象中的敏感字段
    const sanitizeObject = (obj: any) => {
      if (!obj || typeof obj !== "object") return;

      Object.keys(obj).forEach((key) => {
        if (sensitiveFields.includes(key.toLowerCase())) {
          obj[key] = "******"; // 替换敏感数据
        } else if (typeof obj[key] === "object") {
          sanitizeObject(obj[key]); // 递归处理嵌套对象
        }
      });
    };

    sanitizeObject(sanitized);
    return sanitized;
  }
}
