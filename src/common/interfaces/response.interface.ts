/**
 * 统一API响应格式
 */
export class ApiResponse<T> {
  /**
   * 请求是否成功
   */
  success: boolean;

  /**
   * 响应数据
   */
  data: T | null;

  /**
   * 响应消息
   */
  message: string;

  /**
   * 响应时间戳
   */
  timestamp: number;

  /**
   * HTTP状态码
   */
  statusCode: number;
}
