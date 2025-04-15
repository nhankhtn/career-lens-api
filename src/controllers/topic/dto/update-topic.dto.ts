import {
  IsString,
  IsOptional,
  IsArray,
  IsNumber,
  ValidateNested,
} from "class-validator";
import { ResourceDto } from "./create-topic.dto";
import { Type } from "class-transformer";

export class UpdateTopicDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNumber()
  level?: number;

  @IsOptional()
  @IsString()
  parent_id?: string | null;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsNumber()
  priority?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResourceDto)
  resources: ResourceDto[] | null;
}
