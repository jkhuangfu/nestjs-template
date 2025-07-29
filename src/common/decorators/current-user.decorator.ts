import { createParamDecorator, ExecutionContext } from "@nestjs/common";

/**
 * 当前用户装饰器
 * 用于获取当前登录用户信息
 */
export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
