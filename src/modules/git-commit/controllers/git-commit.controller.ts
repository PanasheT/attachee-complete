import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GitCommitService } from '../services';

@Controller('git-commits')
@ApiTags('git-commits')
export class GitCommitController {
  constructor(private readonly service: GitCommitService) {}
}
