import { csrfFetch } from './csrf';

const ADD_IMAGES = 'spots/addImages';

 const addImages = (spotId, image) => {
    return {
        type: ADD_IMAGES,
        payload: {spotId, image}
    }
};


const GET_ALL_SPOTS = 'spots/getALLSpots';

 const loadSpots = (spots) => {
    return {
        type: GET_ALL_SPOTS,
        spots
    }
};

export const getALLSpots = () => async dispatch => {
    const response = await fetch("/api/spots");
        const data = await response.json();
        dispatch(loadSpots(data));
};

const FIND_SPOT = 'spots/getSingleSpot';

 const findSpot = (spot) => {
    return {
        type: FIND_SPOT,
        spot
    };
};

export const getSpot = (spotid) => async dispatch => {
    const response = await fetch(`/api/spots/${spotid}`);
        const data = await response.json();
        dispatch(findSpot(data));
};

export const createSpot = (spotData) => async dispatch => {
    const { address, city, country, description, lat, lng, name, price, state, images } = spotData;
    const response = await csrfFetch(`/api/spots`, {
        method: 'POST',
        body: JSON.stringify({ address, city, country, description, lat, lng, name, price, state }),
    })
    if (response.ok) {
        const newSpot = await response.json();
        const updatedImages = images.map((url, i) => {
            if(i===0 && url !== null){
                return  {previewImage : true,
                url : url}
            }else if(url !== null){
                return {previewImage : false,
                    url : url}
            }
        })

        for await (let image of updatedImages) {
            const {previewImage, url} = image
            let imageRes = await csrfFetch(`/api/spots/${newSpot.id}/images`, {
                method: 'POST',
                body: JSON.stringify({previewImage: previewImage, url: url})
            })
                imageRes = await imageRes.json
                dispatch(addImages(newSpot.id, imageRes))
        }
        dispatch(findSpot(newSpot));
        return newSpot;
    }
};

const UPDATED_SPOT = 'spot/updateSpot'
 const updatedSpot = (spot) => {
    return{
        type: UPDATED_SPOT,
        spot
    }
}
export const editSpot = (spotData) => async dispatch => {
    const { address, city, country, description, lat, lng, name, price, state } = spotData;

    const response = await csrfFetch(`/api/spots/${spotData.id}`, {
        method: 'PUT',
        body: JSON.stringify({ address, city, country, description, lat, lng, name, price, state })
    })
    const newSpot = await response.json()
    if (response.ok) {
        return dispatch(updatedSpot(newSpot))
    }
}
export const getUserSpots = (user) => async dispatch => {
    const response = await csrfFetch('/api/spots')
    const data = await response.json()

    let filterSpots = Object.values(data)
    const ownerSpots = filterSpots.filter(spot => spot.ownerId === user.user.id)

    let ownedSpotsObj = {}

    ownerSpots.map(spot => ownedSpotsObj[spot.id]=spot)
    return dispatch(getALLSpots(ownedSpotsObj))
}
const DELETED_SPOT = 'spots/deleted_Spot'
const deletedSpot = (spot) => {
    return{
        type: DELETED_SPOT,
        spot
    }
}
export const deleteSpot = (spot) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spot.id}`, {
        method:'DELETE'
    })
    const data = await response.json()
    if(response.ok){
        dispatch(deletedSpot(data))
    }
}

const spotsReducer = (state = {}, action) => {
    let newState = {}
    switch (action.type) {
        case GET_ALL_SPOTS: 
        Object.values(action.spots).forEach(spot => newState[spot.id] = spot)
        return {...newState}
        case FIND_SPOT: 
            newState = {...state}
            newState[action.spot.id] = action.spot
            return newState[action.spot.id]
        case UPDATED_SPOT: 
            return {...state, [action.spot.id]: {...state, ...action.spot}}
        case ADD_IMAGES: 
            return {...state, [action.payload.spotId]: {...state, [action.payload.spotid.SpotImages]: action.payload.image}}
            case DELETED_SPOT:
                newState = {...state}
                delete newState[action.spot.id]
                return newState
        default:
            return state;
    }
};

export default spotsReducer;