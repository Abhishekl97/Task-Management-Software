import React, { useEffect, useState } from "react";
import Card from "../Card/Card";
import "./Board.css";
import { MoreHorizontal } from "react-feather";
import Editable from "../Editable/Editable";
import Dropdown from "../Dropdown/Dropdown";
import CardDetails from '../Card/CardDetails/CardDetails';
import { Droppable } from "react-beautiful-dnd";

export default function Board(props) {
  const [show, setShow] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [addTask, setAddTask] = useState(false);
  const BacklogCheck = props.name === "Backlog";

  useEffect(() => {
    document.addEventListener("keypress", (e) => {
      if (e.code === "Enter") setShow(false);
    });
    return () => {
      document.removeEventListener("keypress", (e) => {
        if (e.code === "Enter") setShow(false);
      });
    };
  });

  const handleAddTaskClick = () => {
    setAddTask(true);
  };

  const handleCloseCardDetails = () => {
    setAddTask(false);
  };

  const addNewCard = (cardData) => {
    
    props.addCard(cardData, props.id);
  };

  return (
    <div className="board">
      <div className="board__top">
        <div>
          <p
            onClick={() => {
              setShow(true);
            }}
            className="board__title"
          >
            {props?.name || "Name of Board"}
            <span className="total__cards">{props.card?.length}</span>
          </p>
        </div>
      </div>
      <Droppable droppableId={props.id.toString()}>
        {(provided) => (
          <div
            className="board__cards"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {props.card?.map((items, index) => (
              <Card
                bid={props.id}
                id={items.id}
                index={index}
                key={items.id}
                title={items.title}
                description={items.description}
                deadline={items.deadline}
                addCard={props.addCard}
                updateCard={props.updateCard}
                removeCard={props.removeCard}
                card={items}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <div className="board__footer">
        {BacklogCheck && (
          <button onClick={handleAddTaskClick}>Add Task</button>
        )}
      </div>

      {addTask && (
        <CardDetails
          card={{}} // Empty card for new task
          addCard={addNewCard} // Pass the function to add the new card
          onClose={handleCloseCardDetails} // Function to handle closing the modal
          bid={props.id} // Current board id
        />
      )}
    </div>
  );
};