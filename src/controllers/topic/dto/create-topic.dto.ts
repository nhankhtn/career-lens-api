import { Transform, Type } from "class-transformer";
import {
  IsString,
  IsOptional,
  IsArray,
  IsNumber,
  IsEnum,
  ValidateNested,
} from "class-validator";
import { TopicType } from "src/models/topic.model";

export class ResourceDto {
  @IsOptional()
  @IsString()
  title: string | null;

  @IsEnum(TopicType)
  type: TopicType;

  @IsOptional()
  @IsString()
  url: string | null;
}

export class CreateTopicDto {
  @IsString()
  title: string;

  @IsNumber()
  level: number;

  @IsNumber()
  priority: number;

  @IsOptional()
  @IsString()
  parent_id: string | null;

  @IsOptional()
  @IsString()
  description: string | null;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResourceDto)
  @Transform(({ value }) => (value === null ? undefined : value))
  resources?: ResourceDto[];
}
