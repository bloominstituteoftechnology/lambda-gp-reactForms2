const express = require('express');
const cors = require('cors');
const uuid = require('uuid');

const app = express();
app.use(express.json());
app.use(cors());

const friends = [
  { id: uuid(), name: 'gabe', age: '42' },
  { id: uuid(), name: 'delba', age: '25' },
  { id: uuid(), name: 'emily', age: '24' },
];

app.get('/friends', (req, res) => {
  res.json(friends);
});

app.post('/friends', (req, res) => {
  if (!req.body.name || !req.body.age) {
    res.status(422).json({ error: 'Missing name or age' });
  } else {
    const newFriend = { id: uuid(), ...req.body };
    friends.push(newFriend);
    res.json(newFriend);
  }
});

app.get('*', (req, res) => {
  res.status(404).json({ error: 'This endpoint does not exist' });
});

app.post('*', (req, res) => {
  res.status(404).json({ error: 'This endpoint does not exist' });
});

app.listen(4000, () => {
  console.log('listening on 4000');
});
