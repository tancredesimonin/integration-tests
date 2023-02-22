import {
  ClassSerializerInterceptor,
  Controller, Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger, Param,
  UseInterceptors
} from "@nestjs/common";
import { CONSTANTS } from "@/constants";
import { ApiOkResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { capitalize } from "@shared/utils/capitalize";
import { MailService } from "@mail/mail.service";
import { MailDto } from "@mail/dto/mail.dto";

@ApiTags(capitalize(CONSTANTS.API.MAIL.PATH))
@Controller({
  version: '1'
})
@UseInterceptors(ClassSerializerInterceptor)
export class MailController {
  private readonly logger = new Logger(`mail.controller`);
  constructor(private mail: MailService) {
  }



  @Get(CONSTANTS.API.MAIL.PATH)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Maildev compatible endpoint that returns all emails sent with any provider configured'
  })
  @ApiOkResponse({
    isArray: true,
    type: () => MailDto
  })
  async getAll() {
    return this.mail.findMany({})
  }


  @Delete(CONSTANTS.API.MAIL.DELETE.PATH)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Maildev compatible endpoint that can delete a specific email by its identifier'
  })
  @ApiParam({
    name: 'emailId',
    required: true,
    example: 1,
    description: 'email unique identifier',
  })
  @ApiOkResponse()
  async deleteEmail(@Param('emailId') emailId: string) {
    return this.mail.hardDelete(+emailId)
  }
}