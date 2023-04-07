import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateGitCommitDto, UpdateGitCommitDto } from '../dtos';
import { GitCommitDto, GitCommitDtoFactory } from '../dtos/git-commit.dto';
import { GitCommitEntity } from '../entities';
import { GitCommitService } from '../services';

@Controller('git')
@ApiTags('git')
export class GitCommitController {
  constructor(private readonly service: GitCommitService) {}

  @Post()
  @ApiOperation({ summary: 'Create a git commit.' })
  public async createGitCommit(
    @Body() model: CreateGitCommitDto
  ): Promise<GitCommitDto> {
    const gitCommit: GitCommitEntity = await this.service.createGitCommit(
      model
    );
    return GitCommitDtoFactory(gitCommit);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all git commits.' })
  public async findAllGitCommits(): Promise<GitCommitDto[]> {
    const gitCommits = await this.service.findAllGitCommits();
    return gitCommits.map(GitCommitDtoFactory);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Retrieve a specific git commit by uuid.' })
  public async findOneGitCommit(
    @Param('uuid') uuid: string
  ): Promise<GitCommitDto> {
    const gitCommit = await this.service.findOneGitCommitOrFail(uuid, 'uuid');
    return GitCommitDtoFactory(gitCommit);
  }

  @Put(':uuid')
  @ApiOperation({ summary: 'Update a specific git commit by uuid.' })
  public async updateGitCommit(
    @Param('uuid') uuid: string,
    @Body() model: UpdateGitCommitDto
  ): Promise<GitCommitDto> {
    const updatedGitCommit: GitCommitEntity =
      await this.service.updateGitCommit(uuid, model);

    return GitCommitDtoFactory(updatedGitCommit);
  }

  @Get('student')
  @ApiOperation({ summary: 'Retrieve git commits by student uuid.' })
  public async findGitCommitsByStudentUUID(
    @Query('studentUUID') studentUUID: string
  ): Promise<GitCommitDto[]> {
    const gitCommits = await this.service.findGitCommitsByStudentUUID(
      studentUUID
    );
    return gitCommits.map(GitCommitDtoFactory);
  }
}
