import * as reviewActions from "../../store/reviews";
import * as spotActions from "../../store/spots";

import React from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../Context/Modal";
import FindSpot from "../Spots/FindSpot";


function DeleteReview(reviewId, spotId) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleSubmit = (e) => {
        e.preventDefault();
        let spot = reviewId.spotId
        return dispatch(reviewActions.deleteReview(reviewId.reviewId))
        .then(dispatch(spotActions.getSpot(reviewId.spotId)))
         //   .then(dispatch(reviewActions.getAllReviews(reviewId.spotId)))
            .then(closeModal)
            .catch(
        );
    };

    return (
        <div>
            Are you sure you want to delete this review? This action cannot be reversed.
            <button type='submit' onClick={handleSubmit}>Confirm</button>
            <button onClick={closeModal}>Cancel</button>
        </div>
    );
}

export default DeleteReview;