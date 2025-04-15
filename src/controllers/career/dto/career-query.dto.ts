import { IsArray, IsString } from "class-validator";

export class CareerQueryDto {
  @IsArray()
  @IsString({ each: true })
  skills: string[];

  @IsString()
  education: string;

  @IsString()
  experience: string;

  @IsString()
  environment: string;
}
