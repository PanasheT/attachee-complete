import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateGitCommitDto } from '../dtos';
import { GitCommitDto, GitCommitDtoFactory } from '../dtos/git-commit.dto';
import { GitCommitEntity } from '../entities';
import { GitCommitService } from '../services';

@Controller('git-commits')
@ApiTags('git-commits')
export class GitCommitController {
  constructor(private readonly service: GitCommitService) {}

  @Post()
  @ApiOperation({ summary: 'Create a git commit.' })
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'Git commit successfully created',
    type: GitCommitDto,
  })
  public async createGitCommit(
    @Body() model: CreateGitCommitDto
  ): Promise<GitCommitDto> {
    const gitCommit: GitCommitEntity = await this.service.createGitCommit(
      model
    );
    return GitCommitDtoFactory(gitCommit);
  }
}
