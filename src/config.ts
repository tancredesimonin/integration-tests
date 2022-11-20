import { ConfigModuleOptions } from '@nestjs/config';

export const CONFIG_MODULE_OPTIONS: ConfigModuleOptions = {
  isGlobal: true,
  envFilePath: ['.env'],
};

export const CONFIG = {
  APP: {
    NODE_ENV: 'NODE_ENV',
    DEFAULT_LOG_LEVEL: 'DEFAULT_LOG_LEVEL',
    LOG_HTTP: 'LOG_HTTP',
    BACKEND_DOMAIN: 'BACKEND_DOMAIN',
  },
  PROVIDERS: {
    SENDINBLUE: 'API_KEY_SENDINBLUE'
  }
};
