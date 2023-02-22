import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDefined, IsNumber, IsOptional } from "class-validator";


export class MailDto {

  @ApiProperty()
  @IsDefined()
  id: number;

  @ApiProperty()
  @IsDefined()
  subject: string;

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  templateId: number;



  @ApiProperty()
  @IsDefined()
  to: string;

  @ApiPropertyOptional()
  @IsOptional()
  params: { [key: string]: string; };

  @ApiPropertyOptional()
  @IsOptional()
  parsedParams: { [key: string]: string; };

  @ApiProperty()
  @IsDefined()
  createdAt: string;

  @ApiProperty()
  @IsDefined()
  updatedAt: string;

}