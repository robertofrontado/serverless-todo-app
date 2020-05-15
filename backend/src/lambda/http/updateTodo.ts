import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import * as todoService from '../../services/todoService'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { createLogger } from '../../utils/logger'

const logger = createLogger('todo')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updateTodoRequest: UpdateTodoRequest = { ...JSON.parse(event.body), todoId: todoId }

  logger.info('Updating todo', updateTodoRequest)
  await todoService.updateTodo(updateTodoRequest)

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