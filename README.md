# Backend Overview

This backend is a REST API with an MVC architecture using NestJS.

It is a robust backend with stringent security handling such as but not limited to:
- IP watchlisting
- IP blacklisting
- Ratelimiting
- JWT
- Restricted routes
- RBAC.

Also, this API applies **SOLID principles**, which really adds to the efficacy of the MVC architecture.

This platform does not outsource any backend service, everything is done from scratch.

So far, this API has:
- Authentication and authorization feature
- Cron jobs which expel extraneous data from the database.

## Register Endpoint

- ratelimit
- ip blacklisting and watchlisting
- body validation
- body sanitation
- user uniqueness verification
- verify email (see nodespaceapi for crm for guidance)
