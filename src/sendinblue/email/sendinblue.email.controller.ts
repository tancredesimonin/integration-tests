import {
  ApiBadRequestResponse,
  ApiHeader, ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags, ApiUnauthorizedResponse
} from "@nestjs/swagger";
import { capitalize } from "@shared/utils/capitalize";
import { CONSTANTS } from "@/constants";
import {
  ClassSerializerInterceptor,
  Controller,
  Headers, HttpCode, HttpStatus,
  Logger, Post, UnauthorizedException,
  UseInterceptors
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CONFIG } from "@/config";

@ApiTags(capitalize(CONSTANTS.API.SENDINBLUE.PATH))
@Controller({
  version: '1'
})
@UseInterceptors(ClassSerializerInterceptor)
export class SendinblueEmailController {
  private readonly logger = new Logger(`providers.sendinblue.email.send`);
  constructor(private configService: ConfigService,) {
  }



  @Post(CONSTANTS.API.SENDINBLUE.EMAIL.PATH)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'endpoint to send transaction emails'
  })
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse()
  @ApiHeader({
    name: 'api-key',
    required: true,
    description: 'Your Sendinblue API KEY - will be checked upon the one provided in env',
  })
  async send(@Headers('api-key') apiKey: string) {
    const keyProvided =  this.configService.get<string>(CONFIG.PROVIDERS.SENDINBLUE);

    if (!apiKey || apiKey !== keyProvided) {
      this.logger.error({id: 'sendinblue.email.send'}, 'sendinblue.email.send: api-key invalid')
      throw new UnauthorizedException()
    }
  }
}