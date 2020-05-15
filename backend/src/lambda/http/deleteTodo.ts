import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import * as todoService from '../../services/todoService'
import { createLogger } from '../../utils/logger'

const logger = createLogger('todo')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  logger.info('Deleting todo', { todoId })
  await todoService.deleteTodoById(todoId)

  return {
    statusCode: 200,
    body: ''
  }
})

handler.use(
  cors({ 
    credentials: true 
  })
)
