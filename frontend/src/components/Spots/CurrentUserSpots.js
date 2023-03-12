import * as spotActions from "../../store/spots";

import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import OpenMenu from '../Navigation/OpenMenu';
import DeleteSpot from './DeleteSpot'
import './Spots.css';

function CurrentUserSpots() {
    const dispatch = useDispatch()
    const [isLoaded, setIsLoaded] = useState(false)
    // eslint-disable-next-line
    const [showMenu, setShowMenu] = useState(false);
    let spots = useSelector((state) => state.spots)
    let user = useSelector((state)=> state.session)
    spots = Object.values(spots)

    spots = spots.filter(spot=> spot.ownerId === user.user.id)

    useEffect(() => {
    closeMenu();
    dispatch(spotActions.getUserSpots(user)).then(()=> setIsLoaded(true))
    }, [dispatch, user])

    const closeMenu = () => setShowMenu(false);

    return (
        <>
                  <div id="spots-flex">
        {isLoaded && 
        spots.map((spot) => 
        (<div key={spot.id}>
                <div className="allspots">
            <NavLink to={`/spots/${spot.id}`}>
            <img src={spot.previewImage} alt=""/>
            <div className="city"> <p>{spot.city},{spot.state}</p><p>{spot.avgRating} STARS</p></div>
            </NavLink>
            <div className="buttons">
            <button>
                <NavLink to={`/spots/${spot.id}/edit`}>UPDATE</NavLink>
                </button>
            <OpenMenu
                itemText="Delete"
                onItemClick={closeMenu}
                modalComponent={<DeleteSpot prop={spot}/>}
                />
                </div>
                </div>
            </div>))}
            </div>
        </>
    )
}

export default CurrentUserSpots