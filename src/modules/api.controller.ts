import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { APIDetails } from 'src/common';
import { getAPIDetails, queryAPIDetails } from 'src/util';

@Controller('api')
@ApiTags('api')
export class ApiController {
  @Get('details')
  @ApiOperation({ summary: 'Get API details.' })
  public async getAPIDetails(): Promise<APIDetails> {
    return getAPIDetails();
  }

  @Get('detail')
  @ApiOperation({ summary: 'Query API details.' })
  public async queryAPIDetails(
    @Query('key') key: keyof APIDetails
  ): Promise<string> {
    return queryAPIDetails(key);
  }
}
