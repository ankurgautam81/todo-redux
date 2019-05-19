export const SUCCESS_TODO_LIST = 'SUCCESS_TODO_LIST';

export function setTodoList(data) {
  return {
    type: SUCCESS_TODO_LIST,
    payload: data,
  };
}