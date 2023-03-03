import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateStudentPasswordDto {
  @IsString()
  @IsNotEmpty()
  readonly oldPassword: string;

  @IsString()
  @IsNotEmpty()
  readonly newPassword: string;
}
