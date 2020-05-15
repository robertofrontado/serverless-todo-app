export interface TodoItem {
  todoId: string
  userId: string
  createdAt: string
  name: string
  dueDate: string
  done: boolean
  attachmentUrl?: string
}
