import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MailEntity } from "@/mail/entities/mail.entity";
import { MailService } from "@/mail/mail.service";
import { MailController } from "@mail/mail.controller";


@Module({
  imports: [TypeOrmModule.forFeature([MailEntity])],
  providers: [MailService],
  exports: [MailService],
  controllers: [MailController]
})
export class MailModule {}