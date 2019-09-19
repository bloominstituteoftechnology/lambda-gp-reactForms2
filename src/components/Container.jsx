import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
// we need to GET and POST data using Axios
import axios from 'axios';
// yup is a handy "object shape" validator
// (among other useful things)
import * as yup from 'yup';
import './Container.less';

// both GET and POST operations use this url:
const friendsApi = 'http://localhost:4000/friends';

// 1- THIS GOES INTO <Formik /> `initialValues` prop
const initialFriendForm = {
  name: '',
  age: '',
};

export default function Container() {
  const [friendsList, setFriendsList] = useState([]);
  const [serverError, setServerError] = useState('');

  const fetchFriends = () => {
    // get those friends from the api
    // and set them into the right slice of state!
    // don't forget about the sad path: put something in `serverError`
    axios.get(friendsApi)
      .then(res => {
        setFriendsList(res.data);
      })
      .catch(err => {
        setServerError(err.message);
      });
  };

  // 2- THIS GOES INTO <Formik /> `onSubmit` prop
  const addFriend = () => {
    // THIS FUNCTION NEEDS TO COMPLY WITH FORMIK
    // REQUIREMENTS FOR ACCEPTABLE `onSubmit` FUNCTIONS!
    // It should take two args:
    //     (values) the form values (object)
    //     (actions) formik actions (object)
    // And perform a POST request to the api
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  return (
    <div>
      {/* should be its own component: */}
      {serverError}

      <FriendForm onSubmit={addFriend} />

      {/* should be its own component: */}
      {
        friendsList.length
          ? friendsList.map(fr => (
            <div key={fr.id}>{fr.name} is {fr.age}</div>
          ))
          : 'No friends. Sad!'
      }
    </div>
  );
}

// 3- THIS GOES INTO <Formik /> `validate` prop
const validate = () => {

};

// 4- THIS GOES INTO <Formik /> `validationSchema` prop
const validationSchema = null;

function FriendForm({ onSubmit }) {
  // Let's keep the FriendForm component
  // nice and stateless.
  return (
    <Formik />
  );
}
