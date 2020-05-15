import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as todoService from '../../services/todoService'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event)

  const items = await todoService.getAllTodos();

  return {
    statusCode: 200,
    body: JSON.stringify({
      items
    })
  }
}

// export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//   console.log('Processing event: ', event)

//   const items = await groupService.getAllGroups();

//   return {
//     statusCode: 200,
//     body: JSON.stringify({
//       items
//     })
//   }
// })

// handler.use(
//   cors({ 
//     credentials: true 
//   })
// )