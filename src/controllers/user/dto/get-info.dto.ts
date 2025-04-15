import { IsString, IsEmail, IsDate } from "class-validator";
import { Expose } from "class-transformer";
import { IUser } from "src/models/user.model";
import { Types } from "mongoose";

export class UserResponse implements Partial<IUser> {
  @IsString()
  @Expose()
  _id: Types.ObjectId;

  @IsString()
  @Expose()
  name: string;

  @IsEmail()
  @Expose()
  email: string;

  @IsEmail()
  @Expose()
  password: string;

  @IsString()
  @Expose()
  phone: string;

  @IsString()
  @Expose()
  photo_url: string;

  @IsString()
  @Expose()
  role: string;

  @IsDate()
  @Expose()
  created_at: Date;

  @IsDate()
  @Expose()
  updated_at: Date;
}
