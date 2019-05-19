import * as ActionType from '../actions/todo';
import get from 'lodash/get';

export function todoList(state = [], action) {
  switch (action.type) {
    case ActionType.SUCCESS_TODO_LIST:
      return get(action, 'payload', '');
    default:
      return state;
  }
}