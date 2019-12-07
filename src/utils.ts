import {
  Context,
  SwaggerURLParameter,
  SwaggerBodyParameter,
  SwaggerQueryParameter,
  SwaggerQueryField,
} from '.'

export const extractContextFromToken = (token: string): Context => {
  const splitted = token.split(';')

  return {
    author: splitted[0],
    organization: splitted[1],
    roles: splitted[2].split(','),
  }
}

export const transformURLParameters2Swagger = (parameters: SwaggerURLParameter[]) => parameters
  ? (parameters.map((param: SwaggerURLParameter) => ({
    ...param,
    in: 'path',
    type: param.type || 'string',
  })))
  : []

export const transformBody2Swagger = (body: SwaggerBodyParameter) => body
  ? [{
    ...body,
    in: 'body',
  }]
  : []

export const transformQuery2Swagger = (query: SwaggerQueryParameter) => query
  ? query.items.map((conf: SwaggerQueryField) => ({
    in: 'query',
    name: conf.name,
    description: query.description,
    required: conf.required,
  }))
  : []
