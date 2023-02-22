import {
  ApiBadRequestResponse, ApiBody, ApiCreatedResponse,
  ApiHeader, ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags, ApiUnauthorizedResponse
} from "@nestjs/swagger";
import { capitalize } from "@shared/utils/capitalize";
import { CONSTANTS } from "@/constants";
import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Headers, HttpCode, HttpStatus,
  Logger, NotFoundException, Post, UnauthorizedException,
  UseInterceptors
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CONFIG } from "@/config";
import { SendinblueEmailSendDto } from "@sendinblue/email/sendinblue.email.send.dto";
import { HttpService } from "@nestjs/axios";
import {
  extractEmailParams,
  extractEmailParamsName,
  extractPathFromUrl,
  validateEmailParams
} from "@shared/utils/extractors";
import { SendinblueEmailSendResponseDto } from "@sendinblue/email/sendinblue.email.send.response.dto";
import { MailService } from "@mail/mail.service";

@ApiTags(capitalize(CONSTANTS.API.SENDINBLUE.PATH))
@Controller({
  version: '1'
})
@UseInterceptors(ClassSerializerInterceptor)
export class SendinblueEmailController {
  private readonly logger = new Logger(`providers.sendinblue.email.send`);
  constructor(private configService: ConfigService, private httpService: HttpService, private mailService: MailService) {
  }



  @Post(CONSTANTS.API.SENDINBLUE.EMAIL.PATH)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'endpoint to send transaction emails',
  })
  @ApiBody({
    type: () => SendinblueEmailSendDto
  })
  @ApiCreatedResponse({
    type: () => SendinblueEmailSendResponseDto
  })
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse()
  @ApiHeader({
    name: 'api-key',
    required: true,
    description: 'Your Sendinblue API KEY - will be checked upon the one provided in env',
  })
  async send(@Headers('api-key') apiKey: string, @Body() dto: SendinblueEmailSendDto) {
    const keyProvided =  this.configService.get<string>(CONFIG.PROVIDERS.SENDINBLUE);
    let parsed;

    if (!apiKey || apiKey !== keyProvided) {
      this.logger.error({id: 'sendinblue.email.send'}, 'sendinblue.email.send: api-key invalid')
      throw new UnauthorizedException()
    }

    this.logger.log({id: 'sendinblue.email.send'}, 'sendinblue.email.send: %o', dto)


    // check if the template exist
    const { status, data } = await this.httpService.axiosRef.get(`https://api.sendinblue.com/v3/smtp/templates/${dto.templateId}`, {
      headers: {
        accept: 'application/json',
        'api-key': this.configService.get<string>(CONFIG.PROVIDERS.SENDINBLUE) ?? '',
        'content-type': 'application/json',
      },
    })
    if (!status || status !== 200 || !data.htmlContent) {
      this.logger.error({id: 'sendinblue.email.send'}, 'sendinblue.email.send: templateId invalid')
      throw new NotFoundException();
    }

    const extract = extractEmailParams(data.htmlContent)
    // if the template exist check if this templates requires parameters
    const requiresParameters = extractEmailParamsName(extract);
    this.logger.log({id: 'sendinblue.email.send'}, 'sendinblue.email.send: requiresParameters %o', requiresParameters)


    if (requiresParameters && requiresParameters.length > 0) {
      const { success, invalidParams, validParams } = validateEmailParams(dto.params, requiresParameters)

      if (!success) {
        this.logger.error({id: 'sendinblue.email.send'}, 'sendinblue.email.send: bad parameters %o', invalidParams)
        throw new BadRequestException()
      }

      if (validParams.includes('URL')) {
        parsed = { URL: extractPathFromUrl(dto.params.URL) }
      }

    }




    // create email in the db
    const createdMail = await this.mailService.create({
      templateId: dto.templateId,
      to: dto.to[0].email,
      subject: dto.subject,
      params: dto.params,
      parsedParams: parsed
    })

    return { messageId: createdMail.id };
  }
}