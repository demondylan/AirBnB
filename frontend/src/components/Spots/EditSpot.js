import * as spotActions from "../../store/spots";

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import './Spots.css';


const EditSpot = ({ formType }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { spotId } = useParams()
    const oldSpot = useSelector((state) => state.spots[spotId])
    const [address, setAddress] = useState(oldSpot.address);
    const [city, setCity] = useState(oldSpot.city);
    const [state, setState] = useState(oldSpot.state);
    const [country, setCountry] = useState(oldSpot.country);
    const [lat, setLat] = useState(oldSpot.lat);
    const [lng, setLng] = useState(oldSpot.lng);
    const [name, setName] = useState(oldSpot.name);
    const [description, setDescription] = useState(oldSpot.description);
    const [price, setPrice] = useState(oldSpot.price)

    const updateLat = (e) => setLat(e.target.value);
    const updateLng = (e) => setLng(e.target.value);
    const updateAddress = (e) => setAddress(e.target.value);
    const updateCity = (e) => setCity(e.target.value);
    const updateState = (e) => setState(e.target.value);
    const updateCountry = (e) => setCountry(e.target.value);
    const updateName = (e) => setName(e.target.value);
    const updateDescription = (e) => setDescription(e.target.value);
    const updatePrice = (e) => setPrice(e.target.value);

    useEffect(() => {}, [])

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newSpot = {
            ...oldSpot,
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price,
        };

        let updatedSpot = await dispatch(spotActions.editSpot(newSpot))
        let spotId = updatedSpot.spot.id
        if (updatedSpot) {
            history.push(`/spots/${spotId}`)
            dispatch(spotActions.getSpot(spotId))
        }
    };

    const handleCancelClick = (e) => {
        e.preventDefault();
        formType();
    };

    return (
            <form onSubmit={handleSubmit}>
                <div className="form">
                Country<input
                    type="text"
                    placeholder="Country"
                    value={country}
                    onChange={updateCountry} />
                Street Address<input
                    type="text"
                    placeholder="Street address"
                    required
                    value={address}
                    onChange={updateAddress} />
                City<input
                    type="text"
                    placeholder="City"
                    required
                    value={city}
                    onChange={updateCity} />
                State<input
                    type="text"
                    placeholder="State"
                    required
                    value={state}
                    onChange={updateState} />
                Latitude<input
                    type="number"
                    placeholder="Lat"
                    value={lat}
                    onChange={updateLat} />
                Longitude<input
                    type="number"
                    placeholder="Lng"
                    value={lng}
                    onChange={updateLng} />
                Describe your place to guests<input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={updateDescription} />
                Create a Title<input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={updateName} />
                Price<input
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={updatePrice} />
                <button type="submit">Update</button>
                <button type="button" onClick={handleCancelClick}>Cancel</button>
                </div>
            </form>

    );
};

export default EditSpot;