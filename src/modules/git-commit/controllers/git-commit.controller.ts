import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
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

  @Get()
  @ApiOperation({ summary: 'Retrieve all git commits.' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Git commits successfully retrieved.',
    type: [GitCommitDto],
  })
  public async findAllGitCommits(): Promise<GitCommitDto[]> {
    const gitCommits = await this.service.findAllGitCommits();
    return gitCommits.map(GitCommitDtoFactory);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Retrieve a specific git commit by uuid.' })
  @HttpCode(HttpStatus.FOUND)
  @ApiFoundResponse({
    description: 'Git commit successfully retrieved.',
    type: GitCommitDto,
  })
  public async findOneGitCommit(
    @Param('uuid') uuid: string
  ): Promise<GitCommitDto> {
    const gitCommit = await this.service.findOneGitCommitOrFail(uuid, 'uuid');
    return GitCommitDtoFactory(gitCommit);
  }

  @Get('student')
  @ApiOperation({ summary: 'Retrieve git commits by student uuid.' })
  @HttpCode(HttpStatus.FOUND)
  @ApiFoundResponse({
    description: 'Git commit successfully retrieved.',
    type: [GitCommitDto],
  })
  public async findGitCommitsByStudentUUID(
    @Query('studentUUID') studentUUID: string
  ): Promise<GitCommitDto[]> {
    const gitCommits = await this.service.findGitCommitsByStudentUUID(
      studentUUID
    );
    return gitCommits.map(GitCommitDtoFactory);
  }
}
