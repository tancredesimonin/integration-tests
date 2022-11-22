import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDefined, IsEmail, IsNumber, IsOptional } from "class-validator";

export class SingleContactDto {
  @ApiProperty()
  @IsDefined()
  @IsEmail()
  email: string;
}

export  class SendinblueEmailSendDto {

  @ApiProperty()
  @IsDefined()
  to: SingleContactDto[];

  @ApiPropertyOptional()
  @IsOptional()
  subject?: string;

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  templateId: number;

  @ApiPropertyOptional()
  @IsOptional()
  params: { [key: string]: string; };
}