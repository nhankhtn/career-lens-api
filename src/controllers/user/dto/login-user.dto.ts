import { IsJSON, IsString } from "class-validator";
import { UserResponse } from "./get-info.dto";

export class LoginUserDto {
  @IsString()
  id_token: string;
}

export class LoginReponse {
  @IsString()
  token: string;

  @IsJSON()
  data: UserResponse;
}
