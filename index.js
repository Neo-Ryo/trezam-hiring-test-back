require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 8000;

//models
const users = require('./models/users.model');

//middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const { DB_URI } = process.env;

//mongo atlas client

mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
  console.log('DB joined!');
  //create a user
  app.post('/users', async (req, res) => {
    try {
      const { givenName, firstName, birthday, phone, email } = req.body;
      const user = new users({
        givenName,
        firstName,
        birthday,
        phone,
        email,
      });
      await user.save();
      res.status(201).json({ message: 'user saved' });
    } catch (error) {
      res.status(400).json({ message: 'email already exist' });
      console.log(error);
    }
  });
  //get all users
  app.get('/users', async (req, res) => {
    try {
      const findUsers = await users.find();
      res.status(200).json(findUsers);
    } catch (error) {
      res.status(400).json(error);
    }
  });
  //get one user
  app.get('/users/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const oneUser = await users.findById(id);
      res.status(200).json(oneUser);
    } catch (error) {
      res.status(404).json({ message: 'user not found', error });
    }
  });
  //update user
  app.put('/users/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { givenName, firstName, birthday, phone, email } = req.body;
      const userToUpdate = await users.findByIdAndUpdate(
        { _id: id },
        { givenName, firstName, birthday, phone, email },
        { new: true }
      );
      res.status(200).json(userToUpdate);
    } catch (error) {
      res.status(404).json(error);
    }
  });
  //delete a user
  app.delete('/users/:id/delete', async (req, res) => {
    try {
      const { id } = req.params;
      const deletedUser = await users.findByIdAndDelete({ _id: id });
      res.status(202).json(deletedUser);
    } catch (error) {
      res.status(400).json(error);
    }
  });
});

app.listen(PORT, async () => {
  try {
    console.log(`listenin to http://localhost:${PORT}`);
  } catch (error) {
    console.log(error);
  }
});
