import { QueryOrder } from '@common/@types/enums/common.enum';
import { ToBoolean } from '@common/decorators/transformers/transform.decorators';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
} from 'class-validator';

class DeepPageOptionsDTO {
  /**
   * Where key field
   * @example: email | id
   */
  @IsOptional()
  @IsString()
  @MaxLength(30)
  where?: string;

  /**
   * Where value field
   * @example: email | id
   */
  @IsOptional()
  @IsString()
  @MaxLength(100)
  is?: string;

  /* From date filter */
  @IsOptional()
  @IsDateString()
  from?: string;

  /* End date filter */
  @IsOptional()
  @IsDateString()
  to?: string;

  /**
   * The `withDeleted` property is a boolean flag that
   * indicates whether to include deleted items in the
   * results or not.
   */
  @IsOptional()
  @ToBoolean()
  @IsBoolean()
  withDeleted?: boolean = false;
}

export class PageOptionsDTO extends DeepPageOptionsDTO {
  /* Results page you want to retrieve (0..N) */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number = 1;

  /* Number of results per page */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Max(100)
  readonly take?: number = 5;

  /* Sorting order */
  @IsOptional()
  @IsEnum(QueryOrder)
  readonly order?: QueryOrder = QueryOrder.DESC;

  /* Sorting criteria */
  @IsOptional()
  @IsString()
  @MaxLength(30)
  readonly sort?: string = 'createdAt';
}

export const getSkip = (page: number, take: number): number => {
  return page <= 0 ? (page = 0) : (page - 1) * take;
};
