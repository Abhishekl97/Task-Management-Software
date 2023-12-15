import React, { useState, useEffect } from "react";
import {
  Save,
  Trash,
  X,
} from "react-feather";
import Modal from "../../Modal/Modal";
import "./CardDetails.css";
// import { v4 as uuidv4 } from "uuid";
// import Label from "../../Label/Label";

export default function CardDetails(props) {
  const [title, setTitle] = useState(props.card.title || '');
  const [description, setDescription] = useState(props.card.description || '');
  const [deadline, setDeadline] = useState(props.card.deadline || '');

  const checkNewCard = !props.card.id; 

  const handleSave = () => {
    // Here we would implement the save functionality
    // For example, make an API call
    
    props.card.title = title;
    props.card.description = description;
    props.card.deadline = deadline;
    const cardData = {
      ...props.card
    };
    

    if (checkNewCard) {
      props.addCard(cardData,props.bid);  
    } else {
      props.updateCard(props.bid, props.card.id, {...props.card, ...cardData}); 
    }
    props.onClose(); // Close the modal after save
  };

  return (
    <Modal onClose={props.onClose}>
      <div className="card-details">
        <div className="card-editable-fields">
          <label htmlFor="task-name">Task Name</label>
          <textarea
            id="task-name"
            value={title}
            placeholder="Enter Task Name"
            onChange={(e) => setTitle(e.target.value)}
          />
          
          <label htmlFor="task-description">Task Description</label>
          <textarea
            id="task-description"
            value={description}
            placeholder="Enter Task Description"
            onChange={(e) => setDescription(e.target.value)}
          />

          <label htmlFor="task-deadline">Deadline</label>
          <input
            id="task-deadline"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>
        <div className="card-actions">
          <button className="save-btn" onClick={handleSave}><Save /> Save</button>
          <button className="delete-btn" onClick={() => props.removeCard(props.bid, props.card.id)}>
            <Trash /> Delete</button>
        </div>
      </div>
    </Modal>
  );
}
