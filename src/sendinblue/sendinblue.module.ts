import { Module } from "@nestjs/common";
import { SendinblueService } from "@sendinblue/sendinblue.service";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [HttpModule],
  providers: [SendinblueService],
  exports: [SendinblueService],
  controllers: []
})
export class SendinblueModule {}