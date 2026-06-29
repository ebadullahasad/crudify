import React from "react";
import AddTodo from "./Component/AddTodo";
import TodoItems from "./Component/TodoItems";
import { useState } from "react";
import { nanoid } from "nanoid";
const TodoList = () => {
  const uniqueId = nanoid();
  //Single state object:
  const [todoField, setTodoField] = useState({ id: "", name: "", date: "" });
  //Todos List State:
  let [todos, setTodos] = useState([]);
  //For replace add btn to update btn
  const [editmode, setEditmode] = useState(false);

  //Handle ItemInput:
  let handleItemInput = (e) => {
    let getValue = e.target.value;
    setTodoField({ ...todoField, name: getValue });
  };

  //Handle DateInput:
  let handleDateInput = (e) => {
    let getDate = e.target.value;
    setTodoField({ ...todoField, date: getDate });
  };

  //Handle AddButtonEvent:
  const handleAddTodo = (event) => {
    event.preventDefault();
    if (todoField.name && todoField.date) {
      setTodos([...todos, { ...todoField, id: uniqueId }]);
      setTodoField({ id: "", name: "", date: "" });
    }
  };

  //handle Update Todolist:
  const UpdateList = () => {
    const updatedList = todos.map((todo) =>
      todo.id === todoField.id
        ? { ...todo, name: todoField.name, date: todoField.date }
        : todo
    );
    setTodos(updatedList);
    setTodoField({ id: "", name: "", date: "" });
    setEditmode(false);
  };

  return (
    <div className="md:w-[80%] w-[90%] mx-auto">
      <AddTodo
        todoField={todoField}
        todos={todos}
        editmode={editmode}
        HandleItem={handleItemInput}
        HandleDate={handleDateInput}
        HandleAddTodo={handleAddTodo}
        HandleUpdate={UpdateList}
      />
      <TodoItems
        todos={todos}
        setTodos={setTodos}
        setTodoField={setTodoField}
        setEditmode={setEditmode}
      />
    </div>
  );
};
export default TodoList;
