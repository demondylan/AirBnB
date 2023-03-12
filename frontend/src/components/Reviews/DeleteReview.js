import * as reviewActions from "../../store/reviews";

import React from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../Context/Modal";


function DeleteReview(reviewId, spotId) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleSubmit = (e) => {
        e.preventDefault();

        return dispatch(reviewActions.deleteReview(reviewId.reviewId))
            .then(dispatch(reviewActions.getAllReviews(reviewId.spotId)))
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