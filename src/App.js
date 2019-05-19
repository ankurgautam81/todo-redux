import React, { Component } from 'react';

import { Provider } from 'react-redux';
import { createStore } from 'redux';

import Todo from './components/todo';
import reducer from './reducers';

const store = createStore(reducer);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Todo />         
      </Provider>
    );
  }
}
export default App;