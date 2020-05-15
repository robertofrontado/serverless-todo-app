import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import * as todoService from '../../services/todoService'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const createTodoRequest: CreateTodoRequest = JSON.parse(event.body)

  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  const todo = await todoService.createTodo(createTodoRequest, jwtToken)

  return {
    statusCode: 200,
    body: JSON.stringify({
      item: todo
    })
  }
}

// handler.use(
//   cors({ 
//     credentials: true 
//   })
// )