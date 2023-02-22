# Integration tests

This API goal is to provide a simple tool to locally deploy and setup in order to test integrations.

For the moment, the goal is to be able to test emails with providers used with API.

In that scope, the goal is to provide the same features as maildev in SMTP, but when using specific mail APIs.

## TODO

- ✔ setup the nestjs API project
- ✔ setup health

- setup 
- setup the mail/sendinblue/v3 endpoint to send template emails
    - should read the template configuration
    - verify if given parameters matches the template configuration
    - return status appropriately
    - save mail in local memory for the moment

- setup a maildev compatible API to manage email sent such as:
    - /mail/sendinblue/v3/emails to get all
    - /mail/sendinblue/v3/email/:id to CRUD on that mail

- setup docker


