import * as reviewActions from "../../store/reviews";

import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../Context/Modal";

function PostReview(spotId) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [review, setReview] = useState('')
    const [stars, setStars] = useState(1)
    const updateReview = (e) => setReview(e.target.value)
    const updateStars = (e) => setStars(e.target.value)

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            review,
            stars,
            spotId
        }

        return dispatch(reviewActions.newReview(payload))
            .then(closeModal)
            .catch();
    };

    return (
        <div>
            <h1>How was your stay?</h1>
            <textarea value={review} onChange={updateReview}></textarea>
            <input type="number" placeholder="How Many Stars?" value={stars} onChange={updateStars} min={1} max={5} />
            <button type='submit' onClick={handleSubmit}>Submit Your Review</button>
        </div>
    );
}

export default PostReview;