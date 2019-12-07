# mgr-swagger-express
Swagger annotations for your express project

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