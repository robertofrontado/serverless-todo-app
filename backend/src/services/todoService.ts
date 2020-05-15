import * as uuid from 'uuid'

import { TodoRepository } from '../repositories/TodoRepository'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { TodoItem } from '../models/TodoItem'

const bucketName = process.env.TODOS_S3_BUCKET

const todoRepository = new TodoRepository()

export async function getAllTodos(): Promise<TodoItem[]> {
  return todoRepository.getAllTodos()
}

export async function getAllTodosByUserId(userId: string): Promise<TodoItem[]> {
  return todoRepository.getAllTodosByUserId(userId);
}

export async function createTodo(createTodoRequest: CreateTodoRequest, userId: string): Promise<TodoItem> {
  const todoId = uuid.v4()

  return await todoRepository.createTodo({
    todoId,
    userId,
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    done: false,
    attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${todoId}`,
    createdAt: new Date().toISOString()
  })
}

export async function updateTodo(updateTodoRequest: UpdateTodoRequest) {
  return await todoRepository.updateTodo({
    todoId: updateTodoRequest.todoId,
    name: updateTodoRequest.name,
    dueDate: updateTodoRequest.dueDate,
    done: updateTodoRequest.done
  })
}

export async function deleteTodoById(id: string) {
  return await todoRepository.deleteTodoById(id)
}
