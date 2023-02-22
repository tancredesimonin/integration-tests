export const CONSTANTS = {
  API: {
    PREFIX: 'api',
    DEFAULT_VERSION: '1',
    VERSION_PREFIX: 'v',
    HEALTH: { PATH: 'health' },
    MAIL: { PATH: 'email', DELETE: {PATH: 'email/:emailId'}},
    SENDINBLUE: { PATH: 'sendinblue', ACCOUNT: {PATH: 'sendinblue/v3/account'}, EMAIL: {PATH: 'sendinblue/v3/smtp/email'}}
  },
  SWAGGER: {
    PATH: 'docs',
    TITLE: 'integration-tests.run API Documentation',
    DESCRIPTION: ``,
    VERSION: '1.0',
  },
};
