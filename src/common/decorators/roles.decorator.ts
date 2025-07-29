import { SetMetadata } from "@nestjs/common";

/**
 * 角色装饰器
 * 用于标记需要特定角色的路由
 * @param roles 所需角色列表
 */
export const Roles = (...roles: string[]) => SetMetadata("roles", roles);
