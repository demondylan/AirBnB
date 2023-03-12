import { csrfFetch } from "./csrf";

const GET_ALL_REVIEWS = 'spots/getReviews'

const getReviews = (reviews) => {
    return{
        type: GET_ALL_REVIEWS,
        reviews
    }
}

export const getAllReviews = (spotId) => async dispatch =>{
    const response = await fetch(`/api/spots/${spotId}/reviews`)
    const data = await response.json()
    dispatch(getReviews(data))
}

const ADD_REVIEW = 'spots/addReviews'

const addReview = (review) => {
    return{
        type: ADD_REVIEW,
        review
    }
}

export const newReview = (reviewData) => async dispatch =>{
    let {review, stars, spotId} = reviewData
    
    spotId = Number(spotId.spotId)

    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method:'POST',
        body: JSON.stringify({review, stars})
    })
    const data = await response.json()
    dispatch(addReview(data))

}

const DELETED_REVIEW = 'spots/deleteReview'

const deletedReview = (reviewId) => {
    return{
        type: DELETED_REVIEW,
        reviewId
    }
}

export const deleteReview = (reviewId) => async dispatch=> {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method:'DELETE'
    })
    const data = await response.json()
    if(response.ok){
        dispatch(deletedReview(data))
    }
}


const reviewReducer = (state = {}, action) => {
    let newState = {}
    switch (action.type){
        case GET_ALL_REVIEWS:
            Object.values(action.reviews).forEach(review => newState[review.id] = review)
            return { ...newState}
        case ADD_REVIEW:
            newState = {...state}
            newState[action.review.id] = action.review
            return newState
        case DELETED_REVIEW:
            newState = {...state}
            delete newState[action.reviewId]
            return newState
        default:
            return state
    }
}

export default reviewReducer;
