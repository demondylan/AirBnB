import * as spotActions from "../../store/spots";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import './Spots.css';

function SpotsHome() {
  const dispatch = useDispatch()
  const [isLoaded, setIsLoaded] = useState(false)
  let spots = useSelector((state) => state.spots)
  spots = Object.values(spots)

  useEffect(() => {
    dispatch(spotActions.getALLSpots()).then(() => setIsLoaded(true))
  }, [dispatch])


  return (
    <>
    <div id="spots-flex">
      {isLoaded &&
        spots.map((spot) => (<div key={spot.id}>
          <div className="allspots">
          <NavLink to={`/spots/${spot.id}`}>
            <img src={spot.previewImage} alt="" />
           <div className="city"> <p>{spot.city},{spot.state}</p><p>{Math.round(`${spot.avgRating}` / .10) * .10} STARS</p></div>
           <div className="price"> <p><span>${spot.price}</span> night</p></div>
          </NavLink>
          </div>
        </div>))}
        </div>
    </>
  )
}

export default SpotsHome;