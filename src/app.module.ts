import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CONFIG, CONFIG_MODULE_OPTIONS } from '@/config';
import { LoggerModule } from 'nestjs-pino';
import { SendinblueModule } from "@sendinblue/sendinblue.module";
import { HealthModule } from "@health/health.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MailModule } from "@/mail/mail.module";

@Module({
  imports: [
    ConfigModule.forRoot(CONFIG_MODULE_OPTIONS),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          pinoHttp:
            configService.get(CONFIG.APP.NODE_ENV) === 'production'
              ? {}
              : {
                  customProps: () => ({
                    context: 'HTTP',
                  }),
                  level: configService.get(CONFIG.APP.DEFAULT_LOG_LEVEL),
                  autoLogging:
                    configService.get(CONFIG.APP.LOG_HTTP) === 'true',
                  transport: {
                    target: 'pino-pretty',
                    options: {
                      singleLine: true,
                      colorize: true,
                    },
                  },
                },
        };
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get(CONFIG.DATABASE.URL),
        synchronize: true,
        dropSchema: true,
        keepConnectionAlive: true,
        logging: false,
        autoLoadEntities: true,
      })
    }),
    HealthModule,
    MailModule,
    SendinblueModule,
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
