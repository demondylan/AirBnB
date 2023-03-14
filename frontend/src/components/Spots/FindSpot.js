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

  const [showMenu, setShowMenu] = useState(false);
  const closeMenu = () => setShowMenu(false);
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false)
  const spot = useSelector((state) => state.spots);
  const sessionUser = useSelector((state) => state.session.user)
  let reviews = useSelector((state) => state.reviews)
  reviews = Object.values(reviews)

  useEffect(() => {
    console.log(reviews + "right hereeerre")
    dispatch(spotActions.getSpot(spotId)).then(dispatch(reviewActions.getAllReviews(spotId))).then(() => setIsLoaded(true))
  }, [dispatch, spotId])
 
  const checkUser = reviews.filter(review => review.userid === sessionUser.id)
  
  function getMonthName(num) {
    const months = ["January ", "February ", "March ", "April ", "May ", "June ", "July ", "August ", "September ", "October ", "November ", "December "]
    return months[num-1]
    }
  
  return (
    <>
      <div>
        {isLoaded && <div>
          <h1>{spot.name}</h1>
          <p>{spot.city},{spot.state},{spot.country}</p>
          <div className="detailimage">
          {spot.SpotImages.map(image => {
          if(image.url !== "")
         return <img src={image.url} alt="" />})}
</div>
<div className="ownerreserves"><div><h2>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h2></div>
<div className="reservebox"><p>{spot.price} night</p>
<div className="ratingreviews">
<p>Rating:{!spot.avgRating ? "No Stars" : Math.round(`${spot.avgRating}` / .10) * .10} </p>
 Reviews:{spot.totalReviews}
</div>
<button>Reserve Now</button></div></div>
<div className="detaildescription">
  {spot.description}</div>


<div>
{sessionUser && (reviews.map(review => sessionUser.id === review.userid && (<OpenMenu
                    itemText="Delete"
                    onItemClick={closeMenu}
                    modalComponent={<DeleteReview reviewId={review.id} spotId={spot.id}/>}
                    />)
                    ))}
</div>
                     Number of Reviews:{spot.totalReviews}
                     <div className="reviewbox">
                     {reviews.map((spot) => (<div key={spot.id} className= "eachreviewbox">
<p>{spot.User.firstName}</p>
<p>{getMonthName(spot.updatedAt.slice(0,7).split("-").reverse()[0])}
{spot.updatedAt.slice(0,4)}
</p>
<p>{spot.review}</p></div>
))
}
</div>
<div className="postreviewbutton">
          {sessionUser && (checkUser.length === 0 && (sessionUser.id !== spot.ownerId && (<OpenMenu
                itemText="Post Your Review"
                onItemClick={closeMenu}
                modalComponent={<PostReview spotId={spotId}/>}
                />)))}
                </div>
        </div>
        
        }
      </div>
    </>

  );
}

export default FindSpot;