import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

/**
 * 请求ID中间件
 * 为每个请求生成唯一标识符，便于跟踪完整的请求-响应周期
 */
@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  /**
   * 处理请求并添加请求ID
   * @param request 请求对象
   * @param response 响应对象
   * @param next 下一个中间件函数
   */
  use(request: Request, response: Response, next: NextFunction): void {
    // 生成请求ID
    const requestId = uuidv4();

    // 将请求ID添加到请求对象
    request["requestId"] = requestId;

    // 将请求ID添加到响应头
    response.setHeader("X-Request-ID", requestId);

    next();
  }
}
