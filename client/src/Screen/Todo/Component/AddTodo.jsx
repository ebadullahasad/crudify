import { useEffect } from "react";
import { RxUpdate } from "react-icons/rx";
import { IoMdAddCircle } from "react-icons/io";
const AddTodo = ({
  HandleItem,
  HandleDate,
  HandleUpdate,
  HandleAddTodo,
  todoField,
  editmode,
}) => {
  return (
    <div>
      <h1 className="text-center text3">Todo App</h1>
      <form>
        <div className="grid grid-cols-5 gap-6">
          <div className="border-2 col-span-2">
            <input
              className="w-full py-2 text9"
              type="text"
              name="text"
              id="text"
              value={todoField.name}
              onChange={HandleItem}
            />
          </div>
          <div
            className="col-span-2 border-2 cursor-pointer"
            onClick={() => {
              document.getElementById("datepicker").showPicker();
            }}
          >
            <input
              id="datepicker"
              className="w-full py-2 cursor-pointer"
              type="date"
              name="date"
              value={todoField.date}
              onChange={HandleDate}
            />
          </div>
          <div className="col-span-1">
            {editmode ? (
              <RxUpdate className="w-5 h-5" onClick={HandleUpdate} />
            ) : (
              <button>
                <IoMdAddCircle className="w-8 h-8" onClick={HandleAddTodo} />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
export default AddTodo;
