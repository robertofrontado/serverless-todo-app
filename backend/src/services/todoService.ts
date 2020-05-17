import * as uuid from 'uuid'

import TodoRepository from '../repositories/TodoRepository'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { TodoItem } from '../models/TodoItem'

const bucketName = process.env.TODOS_S3_BUCKET

export class TodoService {

  todoRepository: TodoRepository;

  constructor(todoRepository: TodoRepository = new TodoRepository()) {
    this.todoRepository = todoRepository
  }

  async getAllTodos(): Promise<TodoItem[]> {
    return this.todoRepository.getAllTodos()
  }

  async getAllTodosByUserId(userId: string): Promise<TodoItem[]> {
    return this.todoRepository.getAllTodosByUserId(userId);
  }

  async createTodo(createTodoRequest: CreateTodoRequest, userId: string): Promise<TodoItem> {
    const todoId = uuid.v4()

    return await this.todoRepository.createTodo({
      todoId,
      userId,
      name: createTodoRequest.name,
      dueDate: createTodoRequest.dueDate,
      done: false,
      attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${todoId}`,
      createdAt: new Date().toISOString()
    })
  }

  async updateTodo(updateTodoRequest: UpdateTodoRequest) {
    return await this.todoRepository.updateTodo(updateTodoRequest)
  }

  async deleteTodo(todoId: string, userId: string) {
    return await this.todoRepository.deleteTodo(todoId, userId)
  }

}

export default new TodoService();