import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { WhatsappController } from './controllers';
import { WhatsappService } from './services';

@Module({
  imports: [HttpModule],
  controllers: [WhatsappController],
  exports: [WhatsappService],
  providers: [WhatsappService],
})
export class WhatsappModule {}
