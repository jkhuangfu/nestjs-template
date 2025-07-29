import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Inject,
} from "@nestjs/common";
import { Request, Response } from "express";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { Logger } from "winston";

/**
 * 全局异常过滤器
 * 用于统一处理所有异常，并返回标准格式的错误响应
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}

  /**
   * 捕获并处理异常
   * @param exception 捕获到的异常
   * @param host 参数主机
   */
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 确定HTTP状态码
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // 确定错误消息
    const message =
      exception instanceof HttpException ? exception.message : "服务器内部错误";

    // 构建错误响应对象
    const errorResponse = {
      success: false,
      data: null,
      message,
      timestamp: Date.now(),
      statusCode: status,
      path: request.url,
    };

    // 记录错误日志
    this.logger.error(
      `${request.method} ${request.url} ${status} - ${message}`,
      {
        context: HttpExceptionFilter.name,
        stack: exception instanceof Error ? exception.stack : "",
        error: exception,
      },
    );

    // 发送错误响应
    response.status(status).json(errorResponse);
  }
}
