import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { TodoItem } from '../models/TodoItem'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const XAWS = AWSXRay.captureAWS(AWS)

export class TodoRepository {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todoTable = process.env.TODOS_TABLE,
    private readonly todoUserIdIndex = process.env.TODOS_USER_ID_INDEX) {
  }

  async getAllTodosByUserId(userId: string): Promise<TodoItem[]> {
    const result = await this.docClient.query({
      TableName: this.todoTable,
      IndexName: this.todoUserIdIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }).promise()

    return result.Items as TodoItem[]
  }

  async getAllTodos(): Promise<TodoItem[]> {

    const result = await this.docClient.scan({
      TableName: this.todoTable
    }).promise()

    return result.Items as TodoItem[]
  }

  async createTodo(todo: TodoItem): Promise<TodoItem> {
    await this.docClient.put({
      TableName: this.todoTable,
      Item: todo
    }).promise()

    return todo
  }
  
  async updateTodo(updateTodoRequest: UpdateTodoRequest): Promise<TodoItem> {
    const updated = await this.docClient.update({
      TableName: this.todoTable,
      Key: { 'todoId': updateTodoRequest.todoId },
      UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
      ExpressionAttributeNames: {
        '#name': 'name'
      },
      ExpressionAttributeValues: {
        ':name': updateTodoRequest.name,
        ':dueDate': updateTodoRequest.dueDate,
        ':done': updateTodoRequest.done
      },
      ReturnValues: 'UPDATED_NEW'
    }).promise()

    return updated[0] as TodoItem
  }
  
  async deleteTodoById(id: string) {
    return this.docClient.delete({
      TableName: this.todoTable,
      Key: { 'todoId': id }
    }).promise()
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
