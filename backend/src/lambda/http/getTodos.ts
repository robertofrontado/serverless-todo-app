import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import * as todoService from '../../services/todoService'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('todo')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const userId = getUserId(event)
  
  logger.info('Get all todos for given user', { userId })
  const items = await todoService.getAllTodosByUserId(userId);

  return {
    statusCode: 200,
    body: JSON.stringify({
      items
    })
  }
})

handler.use(
  cors({ 
    credentials: true 
  })
)