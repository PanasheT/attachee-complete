import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WhatsappService } from '../services';

@Controller('whatsapp')
@ApiTags('whatsapp')
export class WhatsappController {
  constructor(private readonly service: WhatsappService) {}

  @Post()
  @ApiOperation({ summary: 'send a message' })
  @HttpCode(HttpStatus.OK)
  public async sendMessage(): Promise<void> {
    return this.service.sendMessage();
  }
}
