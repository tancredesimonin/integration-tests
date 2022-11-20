import { Module } from "@nestjs/common";
import { SendinblueService } from "@sendinblue/sendinblue.service";

@Module({
  imports: [],
  providers: [SendinblueService],
  exports: [SendinblueService],
  controllers: []
})
export class SendinblueModule {}