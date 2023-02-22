import {
  ApiBadRequestResponse,
  ApiCreatedResponse, ApiHeader, ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse
} from "@nestjs/swagger";
import { capitalize } from "@shared/utils/capitalize";
import { CONSTANTS } from "@/constants";
import {
  ClassSerializerInterceptor,
  Controller,
  Get, Headers,
  HttpCode,
  HttpStatus,
  Logger, UnauthorizedException,
  UseInterceptors
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { CONFIG } from "@/config";

@ApiTags(capitalize(CONSTANTS.API.SENDINBLUE.PATH))
@Controller({
  version: '1'
})
@UseInterceptors(ClassSerializerInterceptor)
export class SendinblueAccountController {


  private readonly logger = new Logger(`providers.sendinblue.account`);

  constructor(private configService: ConfigService, private httpService: HttpService) {
  }


  @Get(CONSTANTS.API.SENDINBLUE.ACCOUNT.PATH)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'endpoint to get your account information - will tunnel the call to the live provider'
  })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse()
  @ApiHeader({
    name: 'api-key',
    required: true,
    description: 'Your Sendinblue API KEY - will be checked upon the one provided in env',
  })
  async getAccount(@Headers('api-key') apiKey: string) {
    const { status, data } = await this.httpService.axiosRef.get('https://api.sendinblue.com/v3/account', {
      headers: {
        accept: 'application/json',
        'api-key': this.configService.get<string>(CONFIG.PROVIDERS.SENDINBLUE) ?? '',
        'content-type': 'application/json',
      },
    })
    if (!status || status !== 200) {
      this.logger.error({id: 'providers.sendinblue.account'}, 'providers.sendinblue: authentication failed while retrieving account')
      throw new UnauthorizedException();
    }
    this.logger.log({id: 'providers.sendinblue.account'}, 'providers.sendinblue: account retrieved successfully')
    return data;
  }

}