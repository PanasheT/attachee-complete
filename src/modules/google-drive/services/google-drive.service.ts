import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { google } from 'googleapis';

@Injectable()
export class GoogleDriveService {
  private logger = new Logger(GoogleDriveService.name);

  private readonly scopes = ['https://www.googleapis.com/auth/drive'];

  constructor(private readonly configService: ConfigService) {}

  private async getGoogleDrive() {
    try {
      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: this.configService.get<string>('GOOGLE_CLIENT_EMAIL'),
          private_key: this.configService.get<string>('GOOGLE_PRIVATE_KEY'),
        },
        scopes: this.scopes,
      });

      return google.drive({ version: 'v3', auth });
    } catch (error) {
      this.logger.error(`Failed to retrieve Google Drive client: ${error}`);
    }
  }

  public async uploadFile(fileName: string): Promise<string> {
    try {
      const googleDrive = await this.getGoogleDrive();

      const fileMetadata = {
        name: `${fileName}.pdf`,
        mimeType: 'application/pdf',
        parents: [this.configService.get<string>('GOOGLE_DRIVE_FOLDER_ID')],
      };

      const pdf = fs.createReadStream(`PDF_LOGS/projects/${fileName}.pdf`);

      const { data } = await googleDrive.files.create({
        requestBody: fileMetadata,
        media: {
          mimeType: 'application/pdf',
          body: pdf,
        },
      });

      const fileId: string = data?.id;

      this.logger.log(
        `Successful: file uplaoded with id: ${fileId} to email: ${this.configService.get<string>(
          'GOOGLE_DRIVE_SHARED_FOLDER_EMAIL'
        )}`
      );

      return fileId;
    } catch (error) {
      this.logger.error(`Failed: File ${fileName} upload error: ${error}`);
    }
  }
}
