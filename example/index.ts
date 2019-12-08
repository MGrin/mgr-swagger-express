import express from 'express'
import * as bodyParser from 'body-parser'
import * as swaggerUI from 'swagger-ui-express'
import generateSwagger, { SET_EXPRESS_APP } from 'mgr-swagger-express'

const app = express()
SET_EXPRESS_APP(app)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

import BookService from './BookService'
const bookService = new BookService()

const swaggerDocument = generateSwagger({
  name: "Books service",
  version: "0.0.1",
  description: "Books service description",
  host: `localhost:3000`,
  basePath: '/',
})

app.use(
  '/swagger',
  swaggerUI.serve,
  swaggerUI.setup(swaggerDocument));

app.listen(3000, () => {
  console.log('Server started at port 3000')
})