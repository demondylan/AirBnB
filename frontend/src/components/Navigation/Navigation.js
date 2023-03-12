import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
  
<>
    {isLoaded && (
      <div id= "Header">
     <NavLink to ='/'><img className='Logo'
      src="https://cdn.cdnlogo.com/logos/a/94/airbnb.png"
      alt='Logo' /></NavLink>
      <div id='userCorner'>
      {sessionUser && (
          <NavLink to="/spots/Create">Create a New Spot</NavLink>
        )}
      <div className='profileButton'>
        <ProfileButton user={sessionUser} />
        </div>
      </div>
      </div>
    )}


</>
  );
}

export default Navigation;