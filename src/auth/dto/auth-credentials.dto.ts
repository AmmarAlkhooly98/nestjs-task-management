import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthCredentialsDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @MinLength(4)
  @ApiProperty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  @MinLength(5)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Please enter a password that contains at least one uppercase and lowercase letter, one number or special character.',
  })
  @ApiProperty()
  password: string;
}
