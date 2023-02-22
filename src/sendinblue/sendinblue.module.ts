import { Module } from "@nestjs/common";
import { SendinblueService } from "@sendinblue/sendinblue.service";
import { HttpModule } from "@nestjs/axios";
import { SendinblueEmailController } from "@sendinblue/email/sendinblue.email.controller";
import { SendinblueAccountController } from "@sendinblue/account/sendinblue.account.controller";
import { MailModule } from "@mail/mail.module";

@Module({
  imports: [HttpModule, MailModule],
  providers: [SendinblueService],
  exports: [SendinblueService],
  controllers: [SendinblueAccountController, SendinblueEmailController]
})
export class SendinblueModule {}