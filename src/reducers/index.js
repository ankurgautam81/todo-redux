import { combineReducers } from 'redux';
import { todoList } from '../reducers/todo';

const rootReducer = combineReducers({
  todoList,
});

export default rootReducer;