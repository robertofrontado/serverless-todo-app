import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { TodoItem } from '../models/TodoItem'

// const XAWS = AWSXRay.captureAWS(AWS)

export class TodoRepository {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todoTable = process.env.TODOS_TABLE,
    private readonly todoIdIndex = process.env.TODOS_ID_INDEX) {
  }

  async getAllTodos(): Promise<TodoItem[]> {
    console.log('Getting all todos ', this.todoTable)

    const result = await this.docClient.scan({
      TableName: this.todoTable
    }).promise()

    return result.Items as TodoItem[]
  }

  // async getTodoById(id: String): Promise<TodoItem> {
  //   const todo = await this.docClient.query({
  //     TableName: this.todoTable,
  //     IndexName: this.todoIdIndex,
  //     KeyConditionExpression: 'todoId = :todoId',
  //     ExpressionAttributeValues: {
  //       ':todoId': id
  //     }
  //   }).promise();

  //   return todo[0] as TodoItem
  // }

  async createTodo(todo: TodoItem): Promise<TodoItem> {
    await this.docClient.put({
      TableName: this.todoTable,
      Item: todo
    }).promise()

    return todo
  }
  // TODO - TodoUpdate
  async updateTodo(todo: TodoItem): Promise<TodoItem> {
    await this.docClient.put({
      TableName: this.todoTable,
      Item: todo
    }).promise()

    return todo
  }
  // TODO
  async deleteTodo(todo: TodoItem): Promise<TodoItem> {
    await this.docClient.put({
      TableName: this.todoTable,
      Item: todo
    }).promise()

    return todo
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new AWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new AWS.DynamoDB.DocumentClient()
}
