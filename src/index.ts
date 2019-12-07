import { Express } from 'express'
import {
  extractContextFromToken,
  transformURLParameters2Swagger,
  transformBody2Swagger,
  transformQuery2Swagger,
} from './utils';

let app: any
const paths: any = {}
const definitions: any = {}

const addSwaggerEndpoint = (config: SwaggerEndpoint, method: string) => {
  if (!paths[config.path]) {
    paths[config.path] = {}
  }

  if (paths[config.path][method.toLowerCase()]) {
    throw new Error(`${method.toUpperCase()} ${config.path} has been already declared`)
  }

  const responses = config.success ? {
    200: {
      description: 'OK',
      schema: {
        $ref: config.success,
      },
    },
  } : undefined

  let parameters: SwaggerParameter[] = []
  if (config.auth) {
    parameters.push({
      name: config.auth,
      description: 'User JWT token',
      required: true,
      type: 'string',
      in: 'header',
      example: 'user_id;organization_id;READER,WRITER',
    })
  }
  parameters  = [
    ...transformURLParameters2Swagger(config.parameters),
    ...transformBody2Swagger(config.body),
    ...transformQuery2Swagger(config.query),
  ]

  paths[config.path][method.toLowerCase()] = {
    description: config.description,
    tags: config.tags,
    parameters,
    responses,
  }

  return (target: any, propertyKey: string):
    TypedPropertyDescriptor<(args: object, context: Context) => Promise<any>> => {
    const handler = target[propertyKey]
    const expressPath = config.path.replace(/{([a-zA-Z]+)}/g, ':$1')

    app[method.toLowerCase()](expressPath, async (req: any, res: any) => {
      let args = {}
      if (config.parameters) {
        args = {
          ...args,
          ...req.params,
        }
      }

      if (config.query) {
        args = {
          ...args,
          [config.query.name]: req.query,
        }
      }

      if (config.body) {
        args = {
          ...args,
          [config.body.name]: req.body,
        }
      }

      const context = config.auth ? extractContextFromToken(req.header('x-auth')) : null
      // tslint:disable-next-line: no-console
      console.log(`${propertyKey} [${method.toUpperCase()} ${expressPath}]`, args, context)

      try {
        const result = await Promise.resolve(handler(args, context))
        if (method.toUpperCase() === 'GET' && (result === null || result === undefined)) {
          return res.status(404).send()
        }
        return res.send(result)
      } catch (e) {
        return res.status(e.status || 500).send({
          error: e.message,
        })
      }
    })

    return target
  }
}

const generateSwagger = (config: SwaggerConfig) => ({
  swagger: '2.0',
  info: {
    version: config.version,
    title: config.name,
    description: config.description,
  },
  host: config.host,
  basePath: config.basePath,
  schemes: [
    'http',
  ],
  consumes: [
    'application/json',
  ],
  produces: [
    'application/json',
  ],
  paths,
  definitions: {
    ...definitions,
  },
})

export default generateSwagger
export const SET_EXPRESS_APP = (expressApp: Express) => {
  app = expressApp
}
export const GET = (config: SwaggerEndpoint) => addSwaggerEndpoint(config, 'GET')
export const POST = (config: SwaggerEndpoint) => addSwaggerEndpoint(config, 'POST')
export const PUT = (config: SwaggerEndpoint) => addSwaggerEndpoint(config, 'PUT')
export const DELETE = (config: SwaggerEndpoint) => addSwaggerEndpoint(config, 'DELETE')
export const addSwaggerDefinition = (name: string, definition: object) => {
  if (definitions[name]) {
    throw new Error(`${name} model has been already defined`)
  }
  definitions[name] = definition
}

export type ID = string

export type Context = {
  author: ID
  organization: ID
  roles: string[]
}

export type Error = {
  code: number
  message: string
}

export type SwaggerURLParameter = {
  name: string
  description: string
  type?: string
}
export type SwaggerBodyParameter = {
  name: string
  description: string
  required: boolean
  schema?: any
  type: string
  items?: object
}
export type SwaggerQueryField = {
  name: string
  type: string
  required?: boolean
  items?: object
}
export type SwaggerQueryParameter = {
  name: string,
  description: string,
  items: SwaggerQueryField[]
}
export type SwaggerParameter = {
  in?: string
  example?: any
} & (SwaggerURLParameter | SwaggerBodyParameter | SwaggerQueryParameter)

export type SwaggerSuccessResponse = string

export type SwaggerEndpoint = {
  path: string
  auth?: string
  description?: string
  tags?: string[]
  parameters?: SwaggerURLParameter[]
  query?: SwaggerQueryParameter
  body?: SwaggerBodyParameter
  success?: SwaggerSuccessResponse
}

export type SwaggerConfig = {
  version: string
  name: string
  description: string
  host: string
  basePath: string
}
