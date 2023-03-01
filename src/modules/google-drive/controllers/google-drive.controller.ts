import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GoogleDriveService } from '../services';

@Controller('google-drive')
@ApiTags('google-drive')
export class GoogleDriveController {
  constructor(private readonly googleDriveService: GoogleDriveService) {}
}
