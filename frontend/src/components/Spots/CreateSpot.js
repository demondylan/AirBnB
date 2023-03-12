import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createSpot, getSpot } from "../../store/spots";
import './Spots.css';

const CreateSpot = ({ formType }) => {
  const history = useHistory();
  const dispatch = useDispatch()
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [description, setDescription] = useState("");
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [name, setName] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [image4, setImage4] = useState("");
  const [price, setPrice] = useState(0);
  const [state, setState] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const spot = { address, city, country, description, lat, lng, name, price, state, images: [previewImage, image1, image2, image3, image4] };

    let newSpot = await dispatch(createSpot(spot))
    if (newSpot) {
      let spotId = newSpot.id
      history.push(`/spots/${spotId}`);
      dispatch(getSpot(spotId))
    }
  };

  return (
    <div className='form'>
      <section>
        <form onSubmit={handleSubmit} >
          <label>
            Country
            <input
              type="text"
              placeholder="Country"
              required
              value={country}
              onChange={e => setCountry(e.target.value)}
            />

          </label>
          <br />
          <label>
            Street Address
            <input
              type="text"
              placeholder="Address"
              required
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
          </label>
          <br />
          <label>
            City
            <input
              type="text"
              placeholder="City"
              required
              value={city}
              onChange={e => setCity(e.target.value)}
            />
          </label>
          <br />
          <label>
            State
            <input
              type="text"
              placeholder="State"
              required
              value={state}
              onChange={e => setState(e.target.value)}
            />
          </label>
          <br />
          <label>
            Latitude
            <input
              type="text"
              placeholder="Latitude"
              required
              value={lat}
              onChange={e => setLat(e.target.value)}
            />
          </label>
          <br />
          <label>
            Longitude
            <input
              type="text"
              placeholder="Longitude"
              required
              value={lng}
              onChange={e => setLng(e.target.value)}
            />
          </label>
          <br />
          <label>
            Describe your place to guests
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </label>
          <br />
          <label>
            Create a title for your spot
            <input
              type="text"
              placeholder="Name of your spot"
              required
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
          <br />
          <label>
            Set a base price for your spot
            <input
              type="text"
              placeholder="Price per night (USD)"
              required
              value={price}
              onChange={e => setPrice(e.target.value)}
            />
          </label>
          <br />
          <label>
            Liven up your spot with photos
            <br></br>
            <input
              type="text"
              placeholder="Preview Image URL"
              required
              value={previewImage}
              onChange={e => setPreviewImage(e.target.value)}
            />
          </label>
          <br />
          <label>
            <input
              type="text"
              placeholder="Image URL"
              value={image1}
              onChange={e => setImage1(e.target.value)}
            />
          </label>
          <br />
          <label>
            <input
              type="text"
              placeholder="Image URL"
              value={image2}
              onChange={e => setImage2(e.target.value)}
            />
          </label>
          <br />
          <label>
            <input
              type="text"
              placeholder="Image URL"
              value={image3}
              onChange={e => setImage3(e.target.value)}
            />
          </label>
          <br />
          <label>
            <input
              type="text"
              placeholder="Image URL"
              value={image4}
              onChange={e => setImage4(e.target.value)}
            />
          </label>
          <br></br>
          <button type="submit">Create new Spot</button>

        </form>
      </section>
    </div>
  );
}

export default CreateSpot;