import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import todoService from '../../services/todoService'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const logger = createLogger('todo')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)
  const updateTodoRequest: UpdateTodoRequest = { ...JSON.parse(event.body), todoId, userId }

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