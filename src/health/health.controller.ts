import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CONSTANTS } from '@/constants';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
} from '@nestjs/terminus';
import { ConfigService } from '@nestjs/config';
import { capitalize } from "@shared/utils/capitalize";
import { CONFIG } from "@/config";
import { SendinblueService } from "@sendinblue/sendinblue.service";

@ApiTags(capitalize(CONSTANTS.API.HEALTH.PATH))
@Controller({
  path: CONSTANTS.API.HEALTH.PATH,
  version: '1',
})
export class HealthController {
  constructor(
    private config: ConfigService,
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private sendinblue: SendinblueService
  ) {
  }

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () =>
        this.http.pingCheck(
          'documentation',
          this.config.get(CONFIG.APP.BACKEND_DOMAIN) +
          '/' +
          CONSTANTS.SWAGGER.PATH,
        ),
      () => this.sendinblue.verifyConfig(),
      () => this.sendinblue.verifyAuth()

    ]);
  }
}
