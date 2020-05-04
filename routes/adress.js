const {Adress, validate} = require('../models/adress');
const {User} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const router = express.Router();
const validateObjectId = require('../middleware/validateObjectId');

//get route works in postman
router.get('/', auth, async (req, res) => {
  const adresses = await Adress.find().sort('adress');
  res.send(adresses);
});

router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.user._id);
  if(!user) return res.status(400).send('Invalid user');

  const adress = new Adress({
    adress: req.body.adress,
    zipcode: req.body.zipcode,
    state: req.body.state,
    city: req.body.city,
    userId: user._id
  });
   await adress.save();

  res.send(adress);
});

router.put('/:id', [auth, validateObjectId], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.user._id);
  if(!user) return res.status(400).send('Invalid user');

  const adress = await Adress.findByIdAndUpdate(req.params.id,
    {
      adress: req.body.adress,
      zipcode: req.body.zipcode,
      city: req.body.city,
      state: req.body.state,
      userId: user._id
    }, { new: true });

  if (!adress) return res.status(404).send('The adress with the given ID was not found.');

  res.send(adress);
});

router.delete('/:id',  [auth, validateObjectId], async (req, res) => {
  const adress = await Adress.findByIdAndRemove(req.params.id);

  if (!adress) return res.status(404).send('The adress with the given ID was not found.');

  res.send(adress);
});

router.get('/specific/:id', [auth, validateObjectId], async (req, res) => {
  const adress = await Adress.findById(req.params.id);

  if (!adress) return res.status(404).send('The adress with the given ID was not found.');

  res.send(adress);
});

router.get('/myadresses/', [auth], async (req, res) => {
  const user = await User.findById(req.user._id);
  if(!user) return res.status(404).send('Invalid user');

  const adresses = await Adress.find({'userId': user._id});

  res.send(adresses);
});



module.exports = router;
