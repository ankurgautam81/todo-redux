import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter, Input, Table, Badge } from 'reactstrap';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import { isEmpty, findIndex } from 'lodash';

import { setTodoList } from '../actions/todo';

class Todo extends Component {
  state = {
    canShowAddModal: false,
    IsEditTask: false,
    taskDate: '',
    taskName: '',
    status: 'Undone',
    editTaskDate: '',
    editTaskName: '',
    isEmptyField: false,
  }

  onChangeState = (key, value) => {
    this.setState({ 
      [key]: value
    });
  }

  resetState = () => {
    this.setState({ 
      canShowAddModal: false,
      isEmptyField: false,
      taskDate: '',
      taskName: '',
    });
  }

  onAddingTask = () => {
    const { taskName, taskDate, status } = this.state,
          { todoList } = this.props;
    const list = !isEmpty(todoList) ? todoList : [];

    if (!taskName || !taskDate) {
      this.onChangeState('isEmptyField', true);
      return null;
    }

    list.push({
      taskName, 
      taskDate,
      status,
    });

    this.props.addTask(list);
    this.resetState();
  }

  onEditTask = (props) => {
    const { taskName, taskDate } = props;
    this.setState({ 
      canShowAddModal: !this.state.canShowAddModal,
      IsEditTask: true,
      taskDate,
      taskName,
      editTaskName: taskName,
      editTaskDate: taskDate,
    });
  }

  onSubmitEditTask = async () => {
    const { todoList } = this.props,
          { editTaskName, editTaskDate, taskName, taskDate } = this.state,          
          index = findIndex(todoList, { 'taskName': editTaskName, 'taskDate': editTaskDate }),
          list = todoList;

    if (!taskName || !taskDate) {
      this.onChangeState('isEmptyField', true);
      return null;
    }

    list[index] = {
      taskName,
      taskDate,
      status: 'Undone'
    };

    this.props.addTask(list);
    this.resetState();
  }

  onDoneTask = async (props) => {
    const { todoList } = this.props,
          { taskName, taskDate } = props,
          list = todoList,
          index = findIndex(todoList, { taskName, taskDate });
    
    list[index].status = 'Done';

    this.props.addTask(list);  
    this.resetState();  
  }

  render() {
    const { canShowAddModal, taskDate, taskName, IsEditTask, isEmptyField } = this.state,
          { onChangeState, onAddingTask, onDoneTask, onEditTask, onSubmitEditTask } = this,
          { todoList } = this.props;
          
    return (
      <div className="todo container pt-3 pb-3">
        <Button color="primary" 
          onClick={() => {
            onChangeState('canShowAddModal', !canShowAddModal);
            onChangeState('IsEditTask', false);            
          }}
          className="mb-3"
        >
          Add Task
        </Button>

        {!isEmpty(todoList) && 
          <TaskList
            {...{
              todoList, 
              onEditTask, 
              onDoneTask
            }}
          />
        }

        {canShowAddModal && 
          <AddTaskModal 
            {...{
              canShowAddModal, 
              onChangeState, 
              taskDate,
              taskName,
              onAddingTask,
              IsEditTask,
              onSubmitEditTask,
              isEmptyField,
            }} 
          />
        }
      </div>
    );
  }
}

const TaskList = (props) => {
  const { todoList, onEditTask, onDoneTask } = props;

  return (
    <Table>
      <thead>
        <tr>
          <th>#</th>
          <th>Task Name</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {todoList.map((item, i) => {
          const { taskName, status } = item,
                isTaskDone = status === 'Done';
          return (
            <tr key={i}>
              <th scope="row">{i + 1}</th>
              <td>{taskName}</td>
              <td>
                <Badge color={isTaskDone ? 'success' : 'danger'}>
                  {status}
                </Badge>
              </td>
              <td>
                <Button 
                  color="info"  
                  onClick={() => onEditTask(item)} 
                  disabled={isTaskDone}
                  className="mr-3"
                >
                  Edit
                </Button>
                {!isTaskDone && <Button color="info" onClick={() => onDoneTask(item)}>Done</Button>}

              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

const AddTaskModal = (props) => {
  const { 
    canShowAddModal, 
    onChangeState, 
    taskDate, 
    taskName, 
    onAddingTask, 
    IsEditTask, 
    onSubmitEditTask, 
    isEmptyField 
  } = props;

  return (
    <Modal isOpen={canShowAddModal}>
      <ModalBody>
        {isEmptyField && <Badge color="danger">Please fill all fields...</Badge>}
        <p>Task Name</p>
        <Input 
          placeholder="Please Enter Task" 
          value={taskName} 
          onChange={(e) => onChangeState('taskName', e.target.value)}
        />
        <p className="pt-3">Create Date</p>
        <DatePicker
          minDate={new Date()}
          selected={taskDate}
          onChange={(value) => onChangeState('taskDate', value)}
          placeholderText="Please select date"
        />
      </ModalBody>
      <ModalFooter>              
        <Button color="secondary" onClick={() => onChangeState('canShowAddModal', !canShowAddModal)}>CANCEL</Button>
        {IsEditTask ?
          <Button color="primary" onClick={() => onSubmitEditTask()}>Edit</Button>
          : <Button color="primary" onClick={() => onAddingTask()}>CREATE</Button>
        }
      </ModalFooter>
    </Modal>
  );
};

function mapStateToProps(state) {
  const { todoList } = state;
  return {
    todoList
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    addTask: (list) => dispatch(setTodoList(list)),
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(Todo);
