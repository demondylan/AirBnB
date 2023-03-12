import * as spotActions from "../../store/spots";

import React from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../Context/Modal";

function DeleteSpot(spot) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
  
    return dispatch(spotActions.deleteSpot(spot.prop))
      .then(closeModal)
      .catch(
      );
  };

  return (
    <div className="deletespot">
      Are you sure you want to delete this spot? This action cannot be reversed.
      <div className="deletebuttons"></div>
      <button type='submit' onClick={handleSubmit}>Yes(Delete Spot)</button>
      <button onClick={closeModal}>No(Keep Spot)</button>
    </div>
  );
}

export default DeleteSpot;