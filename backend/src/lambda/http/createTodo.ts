import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import * as todoService from '../../services/todoService'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('todo')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const createTodoRequest: CreateTodoRequest = JSON.parse(event.body)
  const userId = getUserId(event)
  
  logger.info('Creating todo', { ...createTodoRequest, userId })

  const todo = await todoService.createTodo(createTodoRequest, userId)

  return {
    statusCode: 201,
    body: JSON.stringify({
      item: todo
    })
  }
})

handler.use(
  cors({ 
    credentials: true 
  })
)