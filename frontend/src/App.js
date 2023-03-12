import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import LoginFormPage from "./components/LoginFormPage/LoginForm";
import SignupFormPage from "./components/SignupFormPage/SignupForm";
import SpotsHome from "./components/Spots/SpotsHome"
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation/Navigation";
import FindSpot from "./components/Spots/FindSpot";
import CreateSpot from "./components/Spots/CreateSpot";
import EditSpot from "./components/Spots/EditSpot";
import CurrentUserSpots from "./components/Spots/CurrentUserSpots";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/login">
            <LoginFormPage />
          </Route>
          <Route exact path="/signup">
            <SignupFormPage />
          </Route>
          <Route exact path ='/spots/current'>
            <CurrentUserSpots />
          </Route>
          <Route exact path="/spots/create">
            <CreateSpot/>
          </Route>
          <Route exact path='/spots/:spotId/edit'>
          <EditSpot/>
        </Route>
          <Route exact path="/spots/:spotId">
            <FindSpot/>
          </Route>

           <Route exact path="/spots"> 
            <SpotsHome />
          </Route> 
          
          <Route exact path="/"> 
            <SpotsHome />
          </Route> 


        </Switch>
      )}
    </>
  );
}

export default App;