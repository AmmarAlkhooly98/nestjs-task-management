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
  @MinLength(5)
  @MaxLength(20)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d|.*[^\da-zA-Z]).{5,20}$/, {
    message:
      'Please enter a password that contains at least one uppercase and lowercase letter, one number or special character.',
  })
  @ApiProperty()
  password: string;
}
