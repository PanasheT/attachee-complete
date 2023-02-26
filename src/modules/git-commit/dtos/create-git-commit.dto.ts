import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateGitCommitDto {
  @IsUUID()
  @IsNotEmpty()
  readonly dailyLogUUID: string;

  @IsString()
  @IsNotEmpty()
  readonly commitHash: string;

  @IsString()
  @IsOptional()
  readonly commitMessage: string;
}
