import { RiDeleteBinLine } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
let TodoItem = ({
  todoId,
  todoName,
  todoDate,
  DeleteList,
  handleEdit,
  item,
}) => {
  return (
    <div>
      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-2 w-full">{todoName}</div>
        <div className="col-span-2 w-full">{todoDate}</div>
        <div className="flex gap-6 col-span-1">
          <RiDeleteBinLine
            className="w-5 h-5"
            onClick={() => DeleteList(todoId)}
          />
          <FiEdit
            className="w-5 h-5"
            onClick={() => {
              console.log("item (onEdit)", item);
              handleEdit(item);
            }}
          />
        </div>
      </div>
    </div>
  );
};
export default TodoItem;
