import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from '@health/health.controller';
import { SendinblueModule } from "@sendinblue/sendinblue.module";

@Module({
  imports: [TerminusModule, HttpModule, SendinblueModule],
  controllers: [HealthController],
})
export class HealthModule {}