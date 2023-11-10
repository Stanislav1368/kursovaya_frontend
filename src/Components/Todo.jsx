import React from "react";

const Todo = ({ todo }) => {
 
  return (
    <div>
      <div className="bg-pink-500">DROPPABLE</div>
      <div className="state-header p-5 border flex justify-between  items-center">
        {todo.title}#{todo.id}
        <div>
          {todo?.priority && (
            <label
              style={{ borderColor: todo?.priority?.color, backgroundColor: todo?.priority?.color, fontSize: "12px" }}
              className="label w-min rounded-[5px] px-[8px] border-[1px] items-center mb-[5px] font-bold text-3xl">
              {todo?.priority?.name}
            </label>
          )}
        </div>
      </div>
    </div>
  );
};

export default Todo;
