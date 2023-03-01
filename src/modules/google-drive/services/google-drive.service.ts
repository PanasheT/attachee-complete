import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { google } from 'googleapis';

@Injectable()
export class GoogleDriveService {
  private readonly scopes = ['https://www.googleapis.com/auth/drive'];
  private logger = new Logger(GoogleDriveService.name);
  private client_email: string;
  private private_key: string;
  private folder_id: string;
  private parent_email: string;

  constructor(private readonly configService: ConfigService) {
    this.client_email = this.configService.get<string>('GOOGLE_CLIENT_EMAIL');
    this.private_key = this.configService.get<string>('GOOGLE_PRIVATE_KEY');
    this.folder_id = this.configService.get<string>('GOOGLE_DRIVE_FOLDER_ID');
    this.parent_email = this.configService.get<string>(
      'GOOGLE_DRIVE_SHARED_FOLDER_EMAIL'
    );
  }

  private async getGoogleDrive() {
    try {
      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: this.client_email,
          private_key: this.private_key,
        },
        scopes: this.scopes,
      });

      return google.drive({ version: 'v3', auth });
    } catch (error) {
      this.logger.error(`Failed to retrieve Google Drive client: ${error}`);
    }
  }

  public async uploadFile(fileName: string) {
    const googleDrive = await this.getGoogleDrive();
    let fileId: string;

    try {
      const fileMetadata = {
        name: `${fileName}.pdf`,
        mimeType: 'application/pdf',
        parents: [this.folder_id],
      };

      const pdf = fs.createReadStream(`PDF_LOGS/projects/${fileName}.pdf`);

      const { data } = await googleDrive.files.create({
        requestBody: fileMetadata,
        media: {
          mimeType: 'application/pdf',
          body: pdf,
        },
      });

      fileId = data.id;
      this.logger.log(
        `Successful: file uplaoded with id: ${fileId} to email: ${this.parent_email}`
      );
    } catch (error) {
      this.logger.error(`Failed to upload file: ${fileName}, error: ${error}`);
    }
  }

  private async transferFileToParentFolder(fileId: string) {
    const googleDrive = await this.getGoogleDrive();
    const emailAddress = this.parent_email;

    try {
      const requestBody = {
        type: 'user',
        role: 'writer',
        emailAddress,
      };

      await googleDrive.permissions.create({
        fileId,
        requestBody,
      });

      this.logger.log(
        `Successful: file transfer with id: ${fileId} to: ${emailAddress}`
      );
    } catch (error) {
      console.log(error);
      this.logger.error(
        `Failed: file transfer with id: ${fileId} to: ${emailAddress}`
      );
    }
  }
}
