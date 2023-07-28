import { Type } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';

class ParamID {
  @Type(() => Number)
  @IsInt()
  id!: number;
}

class ParamNum {
  @Type(() => Number)
  @IsInt()
  param!: number;
}

class ParamString {
  @IsString()
  param!: string;
}

export { ParamID, ParamNum, ParamString };
