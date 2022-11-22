import { ApiProperty } from "@nestjs/swagger";

export  class SendinblueEmailSendResponseDto {

  @ApiProperty()
  messageId: string;
}