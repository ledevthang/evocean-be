import type { ApiPropertyOptions } from "@nestjs/swagger";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsBoolean, IsInt, IsOptional, Max, Min } from "class-validator";

export function IsBool(
  target: NonNullable<unknown>,
  propertyKey: string | symbol
) {
  Transform(({ value }) => {
    return [true, "enabled", "true"].indexOf(value) > -1;
  })(target, propertyKey);
  IsBoolean()(target, propertyKey);
}

export function OptionalProperty(
  options?: ApiPropertyOptions
): PropertyDecorator {
  return (target: NonNullable<unknown>, propertyKey: string | symbol) => {
    ApiPropertyOptional(options)(target, propertyKey);
    IsOptional()(target, propertyKey);
    Transform(({ value }) => (value !== "" ? value : undefined))(
      target,
      propertyKey
    );
  };
}

export function IsInteger(
  target: NonNullable<unknown>,
  propertyKey: string | symbol
) {
  Type(() => Number)(target, propertyKey);
  IsInt()(target, propertyKey);
}

export class PaginatedQuery {
  @OptionalProperty({ example: 1, description: "default=1" })
  @IsInteger
  @Min(1)
  page: number = 1;

  @OptionalProperty({ example: 60, description: "default=60, max=300" })
  @IsInteger
  @Max(300)
  take: number = 60;
}
