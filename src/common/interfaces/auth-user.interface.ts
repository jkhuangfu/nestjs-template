/**
 * 认证用户接口
 * 描述认证后的用户对象结构
 */
export interface AuthUser {
  userId: number;
  username: string;
  email: string;
  role: string;
}
