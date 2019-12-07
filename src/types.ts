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
