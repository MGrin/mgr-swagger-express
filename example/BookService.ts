import { addSwaggerDefinition, GET, POST, PUT, DELETE } from "mgr-swagger-express"


type Book = {
  id: string
  name: string
  author: string
}
const BookDefinition = {
  type: "object",
  properties: {
    id: {
      type: "string"
    },
    name: {
      type: "string"
    },
    author: {
      type: "string"
    }
  }
}

const BOOKS_STORE: { [id: string]: Book } = {}

export default class BookService {
  constructor() {
    addSwaggerDefinition("Book", BookDefinition)
  }

  @GET({
    path: '/books',
    description: 'Get all books',
    tags: ['Books'],
    success: '#/definitions/Book',
  })
  public async getBooks(args, context) {
    return Object.keys(BOOKS_STORE).map((bookId: string) => BOOKS_STORE[bookId])
  }

  @POST({
    path: '/books',
    description: 'Create new book',
    tags: ['Books'],
    success: '#/definitions/Book',
    body: {
      type: 'object',
      name: 'book',
      description: "New book",
      required: true,
      schema: {
        "$ref": '#/definitions/Book',
      }
    }
  })
  public async createNewBook({ book }: { book: Book }, context) {
    if (!book) {
      throw {
        status: 500,
        message: 'No book provided',
      }
    }

    BOOKS_STORE[book.id] = book
    return book
  }

  @GET({
    path: '/books/:book_id',
    description: 'Get one book',
    parameters: [{
      name: 'book_id',
      description: 'Book id',
    }],
    tags: ['Books'],
    success: '#/definitions/Book',
  })
  public async getBookById({ book_id }: { book_id: string }, context) {
    const book = BOOKS_STORE[book_id]
    if (!book) {
      throw {
        status: 404,
        error: 'Book not found'
      }
    }

    return book
  }

  @PUT({
    path: '/books/:book_id',
    description: 'Update a book',
    tags: ['Books'],
    success: '#/definitions/Book',
    body: {
      type: 'object',
      name: 'update',
      description: "New book",
      required: true,
      schema: {
        "$ref": '#/definitions/Book',
      }
    }
  })
  public async updateBook({ book_id, update }: { book_id: string, update: Book }, context) {
    const book = BOOKS_STORE[book_id]
    if (!book) {
      throw {
        status: 404,
        error: 'Book not found'
      }
    }

    BOOKS_STORE[book.id] = update
    return book
  }

  @DELETE({
    path: '/books/:book_id',
    description: 'Delete a book',
    tags: ['Books'],
  })
  public async deleteBook({ book_id }: { book_id: string }, context) {
    const book = BOOKS_STORE[book_id]
    if (book) {
      delete BOOKS_STORE[book_id]
    }

    return
  }
}
