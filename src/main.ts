import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import { getDataSourceToken } from "@nestjs/typeorm";
import { ResponseInterceptor } from "@common/interceptors/response.interceptor";
import { HttpExceptionFilter } from "@common/filters/http-exception.filter";
import { ValidationExceptionFilter } from "@common/filters/validation.filter";
import { knife4jSetup } from "nestjs-knife4j2";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { networkInterfaces } from "node:os";

// 声明全局变量用于存储日志记录器
let winstonLogger;

function getLocalIp() {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // 跳过内部 IPv6 地址和非 IPv4 地址
      if (!net.internal && net.family === "IPv4") {
        return net.address;
      }
    }
  }
  return "localhost"; // 如果没有找到合适的 IP，返回 localhost
}

// 添加全局错误处理
process.on("unhandledRejection", (reason, _promise) => {
  if (winstonLogger) {
    winstonLogger.error("未处理的Promise拒绝:", reason, "Global");
  } else {
    console.error("未处理的Promise拒绝:", reason);
  }
});

process.on("uncaughtException", (error) => {
  if (winstonLogger) {
    winstonLogger.error("未捕获的异常:", error, "Global");
    // 记录错误堆栈
    if (error instanceof Error) {
      winstonLogger.error(`错误堆栈: ${error.stack}`, "Global");
    }
  } else {
    console.error("未捕获的异常:", error);
    if (error instanceof Error) {
      console.error(`错误堆栈: ${error.stack}`);
    }
  }
});

async function bootstrap() {
  // 创建应用实例，使用 Winston 日志记录器
  const app = await NestFactory.create(AppModule, {
    logger: ["error", "warn", "log", "debug", "verbose"], // 启用所有日志级别，包括 debug
  });

  // 获取 Winston 日志记录器实例
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);

  // 设置全局错误处理程序的日志记录器
  winstonLogger = logger;

  logger.log("正在初始化应用程序...", "Bootstrap");

  // 启用跨域资源共享
  app.enableCors();

  // 设置全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      // 启用详细的验证错误消息
      forbidNonWhitelisted: true,
      disableErrorMessages: false,
      // 确保返回详细的验证错误
      validationError: { target: false, value: true },
    }),
  );

  // 注册全局响应拦截器
  app.useGlobalInterceptors(new ResponseInterceptor());

  // 注册全局异常过滤器
  app.useGlobalFilters(
    new HttpExceptionFilter(app.get(WINSTON_MODULE_NEST_PROVIDER)),
    new ValidationExceptionFilter(app.get(WINSTON_MODULE_NEST_PROVIDER)),
  );

  // 设置Swagger文档
  logger.log("正在配置Swagger文档...", "Bootstrap");
  const config = new DocumentBuilder()
    .setTitle("API")
    .setDescription("API接口文档")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);
  knife4jSetup(app, [
    {
      name: "API",
      url: "api-json",
      swaggerVersion: "3.0",
      location: "api-json",
    },
  ]);

  // 尝试使用不同的端口，避免端口冲突
  const port = process.env.PORT || 3001;
  await app.listen(port);
  const ip = getLocalIp();
  const appUrl = `http://${ip}:${port}`;
  
  // 应用程序完全启动后，检查数据库连接状态
  try {
    const dataSource = app.get(getDataSourceToken());
    if (dataSource && dataSource.isInitialized) {
      logger.log("PostgreSQL数据库连接成功", "Database");
    }
  } catch (error) {
    logger.error(`获取数据源失败: ${error.message}`, "Database");
  }
  
  logger.log(`应用程序成功启动，运行在: ${appUrl}`, "Bootstrap");
  logger.log(`Swagger文档地址: ${appUrl}/api`, "Bootstrap");
  logger.log(`Knife4j文档地址: ${appUrl}/doc.html`, "Bootstrap");
}

// 立即启动应用程序
bootstrap().catch((err) => {
  console.error("应用程序启动失败:", err);
  // 记录错误堆栈
  if (err instanceof Error) {
    console.error(`错误堆栈: ${err.stack}`);
  }
  process.exit(1);
});
