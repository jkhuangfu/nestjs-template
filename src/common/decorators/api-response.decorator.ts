import { applyDecorators, Type } from "@nestjs/common";
import { ApiExtraModels, ApiOkResponse, ApiProperty } from "@nestjs/swagger";
import { ApiResponse } from "@common/interfaces/response.interface";

// 使用全局缓存存储已创建的响应 DTO 类
// 按模型类型和是否为集合分类存储
const globalResponseDtoCache = new Map<string, Type<any>>();

// 不再需要复杂的类名生成逻辑

/**
 * 创建一个类来表示特定模型的响应
 * 相同模型类型的响应会被复用
 */
export function createResponseDto<T>(model: Type<T>): Type<ApiResponse<T>> {
  // 为每个模型类型创建一个唯一的缓存键
  const cacheKey = `${model.name}_single`;

  // 检查全局缓存中是否已存在该模型的响应 DTO
  if (globalResponseDtoCache.has(cacheKey)) {
    return globalResponseDtoCache.get(cacheKey) as Type<ApiResponse<T>>;
  }

  // 创建新的响应 DTO 类
  class ResponseDto implements ApiResponse<T> {
    @ApiProperty({ default: true })
    success: boolean;

    @ApiProperty({ type: model })
    data: T | null;

    @ApiProperty({ example: "操作成功" })
    message: string;

    @ApiProperty({ example: Date.now() })
    timestamp: number;

    @ApiProperty({ example: 200 })
    statusCode: number;
  }

  // 设置类名 - 只使用模型名称，不再包含控制器和方法名
  Object.defineProperty(ResponseDto, "name", {
    value: `${model.name}Response`,
    configurable: true,
  });

  // 将新创建的响应 DTO 类存入全局缓存
  globalResponseDtoCache.set(cacheKey, ResponseDto as Type<ApiResponse<T>>);

  return ResponseDto as Type<ApiResponse<T>>;
}

/**
 * 单个对象API响应装饰器
 * 用于在Swagger文档中展示标准格式的单个对象响应
 *
 * @param model 响应数据模型类型
 * @param description 响应描述
 * @returns 装饰器
 */
export const ApiResponseDecorator = <TModel extends Type<any>>(
  model: TModel,
  description: string = "操作成功",
) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    // 为当前方法创建唯一的响应 DTO
    const ResponseDto = createResponseDto(model);

    // 应用装饰器
    return applyDecorators(
      ApiExtraModels(model, ResponseDto),
      ApiOkResponse({
        description,
        type: ResponseDto,
      }),
    )(target, propertyKey, descriptor);
  };
};

/**
 * 创建一个类来表示特定模型的集合响应
 * 相同模型类型的集合响应会被复用
 */
export function createCollectionResponseDto<T>(
  model: Type<T>,
): Type<ApiResponse<T[]>> {
  // 为每个模型类型的集合创建一个唯一的缓存键
  const cacheKey = `${model.name}_collection`;

  // 检查全局缓存中是否已存在该模型的集合响应 DTO
  if (globalResponseDtoCache.has(cacheKey)) {
    return globalResponseDtoCache.get(cacheKey) as Type<ApiResponse<T[]>>;
  }

  // 创建新的集合响应 DTO 类
  class CollectionResponseDto implements ApiResponse<T[]> {
    @ApiProperty({ default: true })
    success: boolean;

    @ApiProperty({ type: [model] })
    data: T[] | null;

    @ApiProperty({ example: "操作成功" })
    message: string;

    @ApiProperty({ example: Date.now() })
    timestamp: number;

    @ApiProperty({ example: 200 })
    statusCode: number;
  }

  // 设置类名 - 只使用模型名称，不再包含控制器和方法名
  Object.defineProperty(CollectionResponseDto, "name", {
    value: `${model.name}CollectionResponse`,
    configurable: true,
  });

  // 将新创建的集合响应 DTO 类存入全局缓存
  globalResponseDtoCache.set(
    cacheKey,
    CollectionResponseDto as Type<ApiResponse<T[]>>,
  );

  return CollectionResponseDto as Type<ApiResponse<T[]>>;
}

/**
 * 集合对象API响应装饰器
 * 用于在Swagger文档中展示标准格式的集合对象响应
 *
 * @param model 响应数据模型类型
 * @param description 响应描述
 * @returns 装饰器
 */
export const ApiArrayResponseDecorator = <TModel extends Type<any>>(
  model: TModel,
  description: string = "操作成功",
) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    // 获取控制器名称和方法名称
    // const controllerName = target.constructor.name;
    // const methodName = propertyKey;

    // 为当前方法创建唯一的集合响应 DTO
    const CollectionResponseDto = createCollectionResponseDto(model);

    // 应用装饰器
    return applyDecorators(
      ApiExtraModels(model, CollectionResponseDto),
      ApiOkResponse({
        description,
        type: CollectionResponseDto,
      }),
    )(target, propertyKey, descriptor);
  };
};
