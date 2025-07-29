import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { ApiResponse } from "@common/interfaces/response.interface";

/**
 * 响应拦截器
 * 用于统一处理所有接口的响应格式
 */
@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  private readonly logger = new Logger(ResponseInterceptor.name);

  /**
   * 拦截方法
   * @param context 执行上下文
   * @param next 调用处理器
   * @returns 包装后的响应数据
   */
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = response.statusCode;

    // 获取请求信息
    const request = ctx.getRequest();
    const { method, originalUrl } = request;
    const requestId = request["requestId"] || "unknown";
    const startTime = Date.now();

    // 记录性能指标
    const metrics = {
      startTime,
      dbQueryTime: 0,
      externalApiTime: 0,
      processingTime: 0,
    };

    // 将性能指标对象添加到请求中
    request["metrics"] = metrics;

    return next.handle().pipe(
      tap((data) => {
        // 计算响应时间
        const responseTime = Date.now() - startTime;
        metrics.processingTime = responseTime;

        // 获取请求信息（如果存在）
        const requestInfo = request["requestInfo"] || {};

        // 记录响应数据
        this.logger.log(
          `[${requestId}] 响应数据 ${method} ${originalUrl} ${statusCode} ${responseTime}ms`,
          "ResponseInterceptor",
        );

        // 记录性能指标
        this.logger.log(
          `[${requestId}] 性能指标: 总处理时间=${responseTime}ms, 数据库查询时间=${metrics.dbQueryTime}ms, 外部API调用时间=${metrics.externalApiTime}ms`,
          "Performance",
        );

        // 记录详细的响应信息
        this.logger.log(
          `[${requestId}] 响应详情: ${JSON.stringify({
            request: requestInfo,
            response: {
              statusCode,
              responseTime,
              timestamp: new Date().toISOString(),
              data: this.sanitizeData(data),
            },
            metrics: {
              processingTime: metrics.processingTime,
              dbQueryTime: metrics.dbQueryTime,
              externalApiTime: metrics.externalApiTime,
            },
          })}`,
          "ResponseInterceptor",
        );
      }),
      map((data) => ({
        success: true,
        data,
        message: "操作成功",
        timestamp: Date.now(),
        statusCode,
        requestId, // 添加请求ID到响应中
      })),
    );
  }

  /**
   * 清理敏感数据
   * @param data 需要清理的数据
   * @returns 清理后的数据
   */
  private sanitizeData(data: any): any {
    if (!data) return data;

    try {
      // 创建数据的深拷贝
      const sanitized = JSON.parse(JSON.stringify(data));

      // 清理敏感字段
      const sensitiveFields = ["password", "passwordHash", "token", "secret"];

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
    } catch (error) {
      // 如果序列化失败，返回原始数据
      return data;
    }
  }
}
