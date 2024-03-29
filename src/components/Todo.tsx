import React, { FC, useContext, useState } from 'react';
import { CheckCircleFill, Circle, Trash, ExclamationCircleFill } from 'react-bootstrap-icons';
import { getFirestore, deleteDoc, updateDoc ,doc } from 'firebase/firestore'
import firebase from '../firebase'
import moment from 'moment';
import { TodoContext, TodoContextProps } from '../context';
import { animated, useSpring } from '@react-spring/web';
import { TodoItem } from './Todos';

interface TodoProps {
  todo: TodoItem;
}

const Todo: FC<TodoProps> = ({ todo }) => {
  //STATE
  const [hover, setHover] = useState(false)

  //ANIMATION
  const fadeIn = useSpring({
    from : {marginTop : '-12px', opacity : 0},
    to : {marginTop : '0px', opacity : 1}
  })

  //CONTEXT
  const contextValue = useContext(TodoContext);
  if (!contextValue) {
    return null;
  }
  const { selectedTodo, setSelectedTodo }: TodoContextProps = contextValue;

  //HANDLE DELETE
  const handleDelete = async (todo: TodoProps['todo']) => {
  await deleteTodo(todo)
    if(selectedTodo === todo){
      setSelectedTodo(undefined)
    }
  }

  const deleteTodo = async (todo: TodoProps['todo']) => {
    const db = getFirestore(firebase);
    const todoRef = doc(db, 'todos', todo.id);

    try {
      await deleteDoc(todoRef);
      console.log('Document successfully deleted!');
    } catch (error) {
      console.error('Error removing document: ', error);
    }
  };

  //CHECK TODO AS DONE
  const checkTodo = async (todo: TodoProps['todo']) => {
    const db = getFirestore(firebase);
    const todoRef = doc(db, 'todos', todo.id);

    try {
      await updateDoc(todoRef, {
        checked: !todo.checked
      });
      console.log('Document successfully updated!');
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  const todoDate = moment(todo.date);
  const todayDate = moment();
  const isTaskDue = !todo.checked && todoDate.isBefore(todayDate) && !todayDate.isSame(todoDate, 'day');  //CHECK IF TASK HAS BEEN DONE OR NOT

  return (
    <animated.div style={fadeIn} className={`Todo ${isTaskDue ? 'overdue' : ''}`}>
      <div
        className="todo-container"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className="check-todo" onClick={() => checkTodo(todo)}>
          {todo.checked ? (
            <span className='checked'>
              <CheckCircleFill color='#bebebe' />
            </span>
          ) : (
            <span className="unchecked">
              {isTaskDue ? (
                <ExclamationCircleFill color='red' />
              ) : (
                <Circle color={todo.color} />
              )}
            </span>
          )}
        </div>
        <div className="text"
            onClick={() => setSelectedTodo(todo)}
            >
          <p style={{ color: todo.checked ? '#bebebe' : '#000000' }}>{todo.text}</p>
          <span>
            {moment(todo.date).format('DD/MM/YYYY')} - {moment(todo.time).format('HH:mm')}
          </span>

          <div className={`line ${todo.checked ? 'line-through' : ''}`}></div>
        </div>
        <div className="delete-todo"
              onClick={() => handleDelete(todo)}
        >
          {(hover || todo.checked) && <span><Trash /></span>}
        </div>
      </div>
    </animated.div>
  );
};

export default Todo;
