import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface WhatsappDailyLogMessage {
  name: string;
  date: string;
  company: string;
  checkIn: string;
  checkOut: string;
  tasks: string;
}

export function DailyLogMessageParametizer(
  model: WhatsappDailyLogMessage
): { type: string; text: string }[] {
  return [
    { type: 'text', text: model.name },
    { type: 'text', text: model.date },
    { type: 'text', text: model.company },
    { type: 'text', text: model.checkIn },
    { type: 'text', text: model.checkOut },
    { type: 'text', text: model.tasks },
  ];
}

const dummyParams = DailyLogMessageParametizer({
  name: 'John Doe',
  date: '15 March 2023',
  company: 'Company',
  checkIn: '08:00',
  checkOut: '17:00',
  tasks:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultricies lacinia, nisl nisl aliquet nisl, eget aliquet nisl nisl eget nisl. Donec auctor, nisl eget ultricies lacinia, nisl nisl aliquet nisl, eget aliquet nisl nisl eget nisl.',
});

@Injectable()
export class WhatsappService {
  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService
  ) {}

  public async sendMessage(): Promise<void> {
    const apiKey = this.config.get('FACEBOOK_CLIENT_API_KEY');
    const url = this.config.get('WHATSAPP_URL');

    const data = {
      to: `######number`,
      type: 'template',
      template: {
        namespace: this.config.get<string>('WHATSAPP_TEMPLATE_NAMESPACE'),
        language: {
          policy: 'deterministic',
          code: 'en',
        },
        name: 'template.id',
        components: [
          {
            type: 'body',
            parameters: dummyParams,
          },
        ],
      },
    };

    this.httpService
      .post(url, data, {
        headers: {
          'D360-API-KEY': apiKey,
          'Content-Type': 'application/json',
        },
      })
      .toPromise();
  }
}
