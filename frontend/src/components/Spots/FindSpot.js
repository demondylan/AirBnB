import * as spotActions from "../../store/spots";
import * as reviewActions from "../../store/reviews"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import OpenMenu from '../Navigation/OpenMenu';
import PostReview from "../Reviews/PostReview";
import DeleteReview from "../Reviews/DeleteReview";
import './Spots.css';


const FindSpot = () => {
  // eslint-disable-next-line
  const [showMenu, setShowMenu] = useState(false);
  const closeMenu = () => setShowMenu(false);
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false)
  const spot = useSelector((state) => state.spots);
  const sessionUser = useSelector((state) => state.session.user)
  let reviews = useSelector((state) => state.reviews)

  useEffect(() => {
    dispatch(spotActions.getSpot(spotId)).then(dispatch(reviewActions.getAllReviews(spotId))).then(() => setIsLoaded(true))
  }, [dispatch, spotId])

  reviews = Object.values(reviews)
  const spotReviews = reviews.filter(review => review.spotId === Number(spotId))

  
  return (
    <>
      <div className="currentSpot">
        {isLoaded && (<div>
          <h1>{spot.name}</h1>
          {spot.SpotImages.map(image => {
          if(image.url !== "")
         return <img src={image.url} alt="" />})}
          <h2>{spot.city},{spot.state},{spot.country}</h2>
          {spotReviews.reverse().map(review => 
                    <div>{review.review} 
                    {!sessionUser || sessionUser.id === review.userId && (<OpenMenu
                    itemText="Delete"
                    onItemClick={closeMenu}
                    modalComponent={<DeleteReview reviewId={review.id} spotId={spot.id}/>}
                    />)}
                    </div>
                    )}
                     Number of Reviews{spot.numReviews}
          <h1>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h1>
          {!sessionUser || sessionUser.id !== spot.ownerId && (<OpenMenu
                itemText="Post Your Review"
                onItemClick={closeMenu}
                modalComponent={<PostReview spotId={spotId}/>}
                />)}
        </div>
        )
        }
      </div>
    </>

  );
}

export default FindSpot;