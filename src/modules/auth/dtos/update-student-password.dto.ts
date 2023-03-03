import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UpdateStudentPasswordDto {
  @IsUUID()
  @IsNotEmpty()
  readonly studentUUID: string;

  @IsString()
  @IsNotEmpty()
  readonly oldPassword: string;

  @IsString()
  @IsNotEmpty()
  readonly newPassword: string;
}
