import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  Inject,
} from "@nestjs/common";
import { Response } from "express";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { Logger } from "winston";

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}

  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as any;

    // 记录原始错误信息，便于调试
    this.logger.debug(
      `验证错误原始数据: ${JSON.stringify(exceptionResponse)}`,
      {
        context: ValidationExceptionFilter.name,
      },
    );

    // 构建错误响应
    let errorMessage = "请求参数验证失败";
    let formattedErrors = {};

    try {
      // 检查是否为验证错误
      if (exceptionResponse) {
        // 处理 NestJS ValidationPipe 生成的错误格式
        if (Array.isArray(exceptionResponse.message)) {
          const validationErrors = exceptionResponse.message;
          formattedErrors = this.formatErrors(validationErrors);

          // 获取第一个错误作为主要错误消息
          const errorFields = Object.keys(formattedErrors);
          if (errorFields.length > 0) {
            const firstField = errorFields[0];
            const firstErrors = formattedErrors[firstField];
            if (Array.isArray(firstErrors) && firstErrors.length > 0) {
              errorMessage = `参数验证失败: ${firstField} - ${firstErrors[0]}`;
            }
          }
        } else if (typeof exceptionResponse.message === "string") {
          // 处理字符串错误消息
          errorMessage = exceptionResponse.message;
        }
      }
    } catch (error) {
      this.logger.error("处理验证错误时出错", {
        context: ValidationExceptionFilter.name,
        error,
      });
      errorMessage = "处理请求参数验证时出错";
    }

    // 发送错误响应
    const errorResponse = {
      success: false,
      data: null,
      message: errorMessage,
      errors: formattedErrors,
      timestamp: Date.now(),
      statusCode: status,
      path: request.url,
      // 在开发环境中添加原始错误信息，便于调试
      debug:
        process.env.NODE_ENV !== "production" ? exceptionResponse : undefined,
    };

    // // 记录格式化后的错误响应
    // this.logger.debug(`发送给客户端的错误响应: ${JSON.stringify(errorResponse)}`);

    return response.status(status).json(errorResponse);
  }

  private formatErrors(errors: any[]): Record<string, string[]> {
    const result: Record<string, string[]> = {};

    if (!Array.isArray(errors)) {
      return result;
    }

    errors.forEach((error) => {
      if (error.property && error.constraints) {
        result[error.property] = Object.values(error.constraints);
      }

      // 处理嵌套验证错误
      if (error.children && error.children.length > 0) {
        const nestedErrors = this.formatErrors(error.children);
        Object.keys(nestedErrors).forEach((key) => {
          result[`${error.property}.${key}`] = nestedErrors[key];
        });
      }
    });

    return result;
  }
}
