import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { CONFIG } from "@/config";
import {  HealthIndicatorResult } from "@nestjs/terminus";


@Injectable()
export class SendinblueService {
  private readonly logger = new Logger(`providers.sendinblue`);
  constructor(
    @Inject(forwardRef(() => HttpService))
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
  }

  public verifyConfig(): HealthIndicatorResult {
    const keyProvided =  this.configService.get<string>(CONFIG.PROVIDERS.SENDINBLUE);
    if (typeof keyProvided !== "string") {
      this.logger.error({id: 'providers.key-exists.sendinblue'}, 'providers.sendinblue: api-key not provided')
      return { providers_sendinblue_config: { status: 'down' }};
    }
    this.logger.log({id: 'providers.key-exists.sendinblue'}, 'providers.sendinblue: api-key provided')
    return { providers_sendinblue_config: { status: 'up' }};
  }


  public async verifyAuth(): Promise<HealthIndicatorResult> {


    try {
      const { status } = await this.httpService.axiosRef.get('https://api.sendinblue.com/v3/account', {
        headers: {
          accept: 'application/json',
          'api-key': this.configService.get<string>(CONFIG.PROVIDERS.SENDINBLUE) ?? '',
          'content-type': 'application/json',
        },
      })
      if (!status || status !== 200) {
        this.logger.error({id: 'providers.key-valid.sendinblue'}, 'providers.sendinblue: authentication failed')
        return { providers_sendinblue_connection: { status: 'down' }};
      }
      this.logger.log({id: 'providers.key-valid.sendinblue'}, 'providers.sendinblue: authentication successful')
      return { providers_sendinblue_connection: { status: 'up' }};
    } catch (e) {
      this.logger.error({id: 'providers.connection.sendinblue'}, 'providers.sendinblue: connection failed %s',e?.message)
      return { providers_sendinblue_connection: { status: 'down' }};
    }
    }



}