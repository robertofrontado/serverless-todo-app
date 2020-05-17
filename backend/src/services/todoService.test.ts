import { describe, it, expect } from '@jest/globals';

import todoService from './todoService';
import { CreateTodoRequest } from '../requests/CreateTodoRequest';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';

const USER_ID = 'userId'
const NAME = 'Created from tests'
const DUE_DATE = new Date().toISOString()

describe('todo tests', () => {
    
    it('should create a todo item', async () => {
        const createTodoRequest: CreateTodoRequest = { 
            name: NAME, 
            dueDate: DUE_DATE
        };

        const todo = await todoService.createTodo(createTodoRequest, USER_ID);

        expect(todo.todoId).toBeDefined();
        expect(todo.userId).toEqual(USER_ID);
        expect(todo.dueDate).toEqual(DUE_DATE);
        expect(todo.done).toBeFalsy();
        expect(todo.name).toEqual(NAME);
        expect(todo.attachmentUrl).toBeDefined();
    })

    it('should return all todo items given userId', async () => {
        const todos = await todoService.getAllTodosByUserId(USER_ID);

        expect(todos.length).toBeGreaterThan(0);
    })

    it('should update a todo item', async () => {
        const createTodoRequest: CreateTodoRequest = { 
            name: NAME, 
            dueDate: DUE_DATE
        };

        const todoToUpdate = await todoService.createTodo(createTodoRequest, USER_ID);

        const updateTodoRequest: UpdateTodoRequest = { 
            todoId: todoToUpdate.todoId, 
            userId: todoToUpdate.userId,
            name: todoToUpdate.name, 
            done: !todoToUpdate.done, 
            dueDate: todoToUpdate.dueDate
         };

        const todoUpdated = await todoService.updateTodo(updateTodoRequest);

        expect(todoUpdated).toBeDefined();
        expect(todoUpdated.todoId).toEqual(todoToUpdate.todoId);
        expect(todoUpdated.name).toEqual(todoToUpdate.name);
        expect(todoUpdated.done).not.toEqual(todoToUpdate.done);
        expect(todoUpdated.dueDate).toEqual(todoToUpdate.dueDate);
    })

    it('should delete a todo item given todoId', async () => {
        const createTodoRequest: CreateTodoRequest = { 
            name: NAME, 
            dueDate: DUE_DATE
        };

        const todoToDelete = await todoService.createTodo(createTodoRequest, USER_ID);
        await todoService.deleteTodo(todoToDelete.todoId, USER_ID);

        const todosAfterDeletion = await todoService.getAllTodosByUserId(USER_ID);
        const deleted = todosAfterDeletion.every(value => value.todoId !== todoToDelete.todoId);
        expect(deleted).toBeTruthy();
    })
})