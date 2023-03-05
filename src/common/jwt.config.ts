import { ConfigModule, ConfigService } from '@nestjs/config';

export const JWT_CONFIG: any = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => ({
    secret: config.get<string>('TOKEN_SECRET'),
    signOptions: {
      expiresIn: config.get<number>('TOKEN_DURATION'),
    },
    verifyOptions: {
      ignoreExpiration: false,
    },
  }),
};
