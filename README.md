# mgr-swagger-express
Swagger annotations for your express project
[Medium article](https://medium.com/@mgrin/document-your-express-api-with-swagger-annotations-b530db6365d0)

# Usage

## Install

`npm install mgr-swagger-express --save`

or

`yarn add mgr-swagger-express`

## Use

app.js:
```ts
import express from 'express'
import generateSwagger, { SET_EXPRESS_APP } from 'mgr-swagger-express'

const app = express()
SET_EXPRESS_APP(app)

import MyResource from './resource.service' // Note, the import should happen AFTER the SET_EXPRESS_APP call

const swaggerDocument = generateSwagger({
  name: "My Service Name",
  version: "0.0.1",
  description: "My Service Description",
  host: `localhost:5000`,
  basePath: '/',
})

app.use(
  '/swagger',
  swaggerUI.serve,
  swaggerUI.setup(swaggerDocument));
}
```

resource.service.js:
```ts
import { GET, POST, addSwaggerDefinition } from "mgr-swagger-express"

const ResourceDescription = {
  type: 'object',
  properties: {
    id: 'string',
    name: 'string'
  }
}

const ResourceStatus = {
  type: 'object',
  properties: {
    status: {
      type: 'string',
      enum: ['running', 'failed', 'stopped']
    }
  }
}

export default class BotService {
  constructor() {
    addSwaggerDefinition('ResourceDescription', ResourceDescription)
    addSwaggerDefinition('ResourceStatus', ResourceStatus)
  }

  @GET({
    path: '/resource',
    description: 'Get all resources available',
    tags: ['Resources'],
    success: '#/definitions/ResourceDescription',
  })
  public async getAvailableResources(args, context) {
    return []
  }

  @POST({
    path: '/resource/{resourceId}',
    description: 'Update resource by ID and get its status',
    parameters: [{
      name: 'resourceId',
      description: 'Resource ID',
    }],
    tags: ['Resources'],
    success: '#/definitions/ResourceStatus'
  })
  public async updateResource(args, context) {
    return {
      status: 'failed'
    }
  }
}
```

## Authentication

Set `auth` to the name of the header carrying the token. The header is documented as a
required parameter on that operation, and its value is parsed into the `context` argument
your handler receives:

```typescript
  @GET({
    path: '/resource',
    description: 'Get all resources available',
    auth: 'x-auth',
    tags: ['Resources'],
  })
  public async getAvailableResources(args, context) {
    // context is { author, organization, roles }
    return []
  }
```

The token format is `author;organization;roles`, where roles is a comma separated list —
for example `user_id;organization_id;READER,WRITER`.

Requests that omit the header, or send a token with fewer than three segments, are
rejected with `401` before your handler runs. Endpoints without `auth` receive `null` as
their context.