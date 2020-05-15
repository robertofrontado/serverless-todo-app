import * as uuid from 'uuid'

import { TodoRepository } from '../repositories/TodoRepository'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { parseUserId } from '../auth/utils'
import { TodoItem } from '../models/TodoItem'

const todoRepository = new TodoRepository()

export async function getAllTodos(): Promise<TodoItem[]> {
  return todoRepository.getAllTodos()
}

// export async function getTodoById(id: String): Promise<TodoItem> {
//   return todoRepository.getTodoById(id);
// }

export async function createTodo(createTodoRequest: CreateTodoRequest, jwtToken: string): Promise<TodoItem> {
  const todoId = uuid.v4()
  const userId = parseUserId(jwtToken)

  return await todoRepository.createTodo({
    id: todoId,
    userId: userId,
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    done: false,
    createdAt: new Date().toISOString()
  })
}

export async function updateTodo(updateTodoRequest: UpdateTodoRequest, jwtToken: string) {
  const userId = parseUserId(jwtToken)

  return await todoRepository.updateTodo({
    id: userId,
    userId: userId,
    name: updateTodoRequest.name,
    dueDate: updateTodoRequest.dueDate,
    done: false,
    createdAt: new Date().toISOString()
  })
}

export async function deleteTodo() {
  
}
