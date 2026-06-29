import TodoItem from "./TodoItem";

let TodoItems = ({ todos, setTodos, setTodoField, setEditmode }) => {
  //Delete Functionality:
  let HandleDeleteList = (id) => {
    const deleteTodos = todos.filter(
      (item) =>
        item.id !== id
    );
    setTodos(deleteTodos);
  };

  //Edit Work:
  const handleEdit = (todo) => {
    setEditmode(true);
    setTodoField({
      id: todo.id,
      name: todo.name,
      date: todo.date,
    });
  };
  //Edit Work
  return (
    <div>
      {todos.map((item, ind) => (
        <TodoItem
          key={ind}
          todoId={item.id}
          todoName={item.name}
          todoDate={item.date}
          DeleteList={HandleDeleteList}
          handleEdit={handleEdit}
          item={item}
        />
      ))}
    </div>
  );
};
export default TodoItems;
