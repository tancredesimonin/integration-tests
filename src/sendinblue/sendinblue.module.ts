import { Module } from "@nestjs/common";
import { SendinblueService } from "@sendinblue/sendinblue.service";
import { HttpModule } from "@nestjs/axios";
import { SendinblueEmailController } from "@sendinblue/email/sendinblue.email.controller";

@Module({
  imports: [HttpModule],
  providers: [SendinblueService],
  exports: [SendinblueService],
  controllers: [SendinblueEmailController]
})
export class SendinblueModule {}