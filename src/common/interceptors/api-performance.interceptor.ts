import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

/**
 * 外部API性能监控拦截器
 * 用于记录外部API调用的执行时间
 */
@Injectable()
export class ApiPerformanceInterceptor implements NestInterceptor {
  private readonly logger = new Logger("ApiPerformance");

  /**
   * 拦截方法
   * @param context 执行上下文
   * @param next 调用处理器
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const requestId = request["requestId"] || "unknown";
    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;

        // 获取请求中的性能指标对象
        const metrics = request["metrics"] || {};

        // 更新外部API调用时间
        metrics.externalApiTime = (metrics.externalApiTime || 0) + duration;

        // 记录外部API调用性能
        this.logger.debug(
          `[${requestId}] 外部API调用完成，耗时: ${duration}ms`,
          "ApiPerformance",
        );
      }),
    );
  }
}
