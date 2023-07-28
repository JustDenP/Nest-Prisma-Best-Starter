import { Role } from '@common/@types/enums/common.enum';
import { IsPassword } from '@common/decorators/validators/is-password.decorator';
import { IsUnique } from '@common/decorators/validators/is-unique.decorator';
import { MinMaxLength } from '@common/decorators/validators/min-max-length.decorator';
import { IsEmail, IsEnum, IsString } from 'class-validator';
export class CreateUserDTO {
  /**
   * Role of user
   * @example ADMIN || USER
   */
  @IsEnum(Role)
  role: Role;

  /**
   * Email of user
   * @example sus123@gmail.com
   */
  @IsUnique('user', 'email')
  @IsEmail()
  email: string;

  /**
   * Password of user
   * @example SomePassword@123
   */
  @IsString()
  @MinMaxLength({ minLength: 6, maxLength: 100 })
  @IsPassword()
  password: string;

  /**
   * First name of user
   * @example John
   */
  @IsString()
  @MinMaxLength({ minLength: 3, maxLength: 50 })
  firstName: string;

  /**
   * Last name of user
   * @example Doe
   */
  @IsString()
  @MinMaxLength({ minLength: 3, maxLength: 50 })
  lastName: string;
}
