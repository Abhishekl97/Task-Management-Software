import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { Calendar, CheckSquare, Clock, MoreHorizontal } from "react-feather";
import Dropdown from "../Dropdown/Dropdown";
import Modal from "../Modal/Modal";
import Tag from "../Tags/Tag";
import "./Card.css";
import CardDetails from "./CardDetails/CardDetails";
const Card = (props) => {
  const [dropdown, setDropdown] = useState(false);
  const [modalShow, setModalShow] = useState(false);

  return (
    <Draggable
      key={props.id.toString()}
      draggableId={props.id.toString()}
      index={props.index}
    >
      {(provided) => (
        <>
          {modalShow && (
            <CardDetails
              updateCard={props.updateCard}
              onClose={setModalShow}
              card={props.card}
              bid={props.bid}
              removeCard={props.removeCard}
            />
          )}

          <div
            className="custom__card"
            onClick={() => {
              setModalShow(true);
            }}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <div className="card__content">
            <h4>{props.title}</h4>
            <p>{props.description}</p>
            <p>Deadline: {props.deadline}</p>
          </div>

            {provided.placeholder}
          </div>
        </>
      )}
    </Draggable>
  );
};

export default Card;
