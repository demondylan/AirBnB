import * as sessionActions from "../../store/session";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../Context/Modal";
import "./LoginForm.css";
import { useHistory } from "react-router-dom";

function LoginForm() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal).then(history.push('/'))
      .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors)  setErrors(data.errors); 
            
          
        }
      );
  };

  return (
    <>
    <div className="loginpage">
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Log In</button>
      </form>
      </div>
    </>
  );
}
export default LoginForm;