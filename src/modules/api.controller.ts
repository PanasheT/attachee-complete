import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import {
  ApiFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { APIDetails } from 'src/common';
import { getAPIDetails, queryAPIDetails } from 'src/util';

@Controller('api')
@ApiTags('api')
export class ApiController {
  @Get('details')
  @ApiOperation({ summary: 'Get API details.' })
  @HttpCode(HttpStatus.FOUND)
  @ApiFoundResponse({
    description: 'API details successfully retrieved.',
  })
  public async getAPIDetails(): Promise<APIDetails> {
    return getAPIDetails();
  }

  @Get('detail')
  @ApiOperation({ summary: 'Query API details.' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'API query successful.',
    type: String,
  })
  public async queryAPIDetails(
    @Query('key') key: keyof APIDetails
  ): Promise<string> {
    return queryAPIDetails(key);
  }
}
