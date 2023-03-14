import * as reviewActions from "../../store/reviews";
import * as spotActions from "../../store/spots";

import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../Context/Modal";

function PostReview(spotid) {
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
            spotid
        }
       let newSpotid = Number(spotid.spotId)


        return dispatch(reviewActions.newReview(payload))
        .then(dispatch(spotActions.getSpot(newSpotid)))
            .then(closeModal)
            .catch();
    };

    return (
        <div>
                    <form onSubmit={handleSubmit} >
            <h1>How was your stay?</h1>
            <input type= "text" placeholder="Enter your Experience"
              required onChange={updateReview} ></input>
            <input type="number" placeholder="How Many Stars?" value={stars} onChange={updateStars} min={1} max={5} />
            <button type='submit'>Submit Your Review</button>
            </form>
        </div>
    );
}

export default PostReview;