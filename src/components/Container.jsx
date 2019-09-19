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
  const addFriend = (formValues, actions) => {
    // THIS FUNCTION NEEDS TO COMPLY WITH FORMIK
    // REQUIREMENTS FOR ACCEPTABLE `onSubmit` FUNCTIONS!
    // It should take two args:
    //     (values) the form values (object)
    //     (actions) formik actions (object)
    // And perform a POST request to the api
    const friendToPost = {
      name: formValues.name,
      age: formValues.age,
    };
    axios.post(friendsApi, friendToPost)
      .then(res => {
        // res.data contains the newly created friend
        const newLyCreatedFriendFromServer = res.data;
        setFriendsList(friendsList.concat(newLyCreatedFriendFromServer));
        actions.resetForm();
      })
      .catch(err => {
        debugger
      });
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
const validate = (formValues) => {
  const errors = {};
  // take a look inside those forms values
  // and add errors if we don't like what we see
  // return the errors object

  // investigating the formValues.name
  if (!formValues.name) {
    errors.name = 'You need to supply a name, dummy!';
  } else if (formValues.name.length < 3) {
    errors.name = 'That name looks a little short';
  }

  // investigating the formValues.age
  if (!formValues.age) {
    errors.age = 'We need an age!!';
  }
  return errors;
};

// 4- THIS GOES INTO <Formik /> `validationSchema` prop
const validationSchema = yup.object().shape({
  name: yup.string()
    .required('GAGAHHH WE NEED NAME'),
  age: yup.number()
    .required('NO JOY GIMME AGE')
    .integer()
    .positive('are you really trying to feed a negative number????'),
});

function FriendForm({ onSubmit }) {
  // Let's keep the FriendForm component
  // nice and stateless.
  return (
    // needs 3 props
    <Formik
      validationSchema={validationSchema}
      validate={validate}
      initialValues={initialFriendForm}
      onSubmit={onSubmit}
      render={props => {
        return (
          // we will use pre-baked components
          // supplied by formik lib (like Formik)
          <Form>
            {
              !props.dirty && <div>time to start typing!!</div>
            }
            <div>
              <label>
                Name
                <Field name='name' type='text' placeholder='Name' />
                <ErrorMessage name='name' component='div' />
              </label>
            </div>
            <div>
              <label>
                Age
                <Field name='age' type='text' placeholder='Age' />
                <ErrorMessage name='age' component='div' />
              </label>
            </div>
            <button type='submit'>Submit</button>
          </Form>
        );
      }}
    />
  );
}
