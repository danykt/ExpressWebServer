const {Adress} = require('../models/adress');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const emp = require('../middleware/emp');
const {User} = require('../models/user');
const {Order, validate} = require('../models/order');
const {Schedule} = require('../models/schedule')
const mongoose = require('mongoose');
const express = require('express');
const validateObjectId = require('../middleware/validateObjectId');

const router = express.Router();


router.get('/', [auth, emp], async (req, res) => {
  const orders = await Order.find().sort('-datePlaced');
  res.send(orders);
});

router.patch('/deliverOrder/:id', [auth, emp], async(req,res) =>{

  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).send('The order with the given ID was not found.');


  order.isDelivered = true;
  order.isAssigned = true;
  order.dateDelivered = new Date().now;

  await order.save();

  res.send(order);

});

router.patch('/undeliverOrder/:id', [auth, emp], async(req,res) =>{

  const order = await Order.findById(req.params.id);

  if (!order) return res.status(404).send('The order with the given ID was not found.');

  order.isDelivered = false;
  order.dateDelivered = null;

  await order.save();

  res.send(order);

});

router.patch('/setOrderPrice/:id', [auth, admin], async(req,res) =>{

  const order = await Order.findById(req.params.id);

  if (!order) return res.status(404).send('The order with the given ID was not found.');

  order.amount = req.body.amount;

  await order.save();

  res.send(order);

});

router.patch('/markOrderAsPaid/:id', [auth, admin], async(req,res) =>{

  const order = await Order.findById(req.params.id);

  if (!order) return res.status(404).send('The order with the given ID was not found.');

  order.isPaid = true;

  await order.save();

  res.send(order);

});

router.patch('/markOrderAsUnpaid/:id', [auth, admin], async(req,res) =>{

  const order = await Order.findById(req.params.id);

  if (!order) return res.status(404).send('The order with the given ID was not found.');

  order.isPaid = false;

  await order.save();

  res.send(order);

});



router.post('/byEmployee/', [auth, emp], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.body.userId);
  if(!user) return res.status(400).send('Invalid user');

  const originAdress = await Adress.findById(req.body.originAdressId);
  if(!originAdress) return res.status(400).send('Invalid originAdressId');

  const destinationAdress = await Adress.findById(req.body.destinationAdressId);
  if(!destinationAdress) return res.status(400).send('Invalid destinationAdressId');


  const order = new Order({
    user:{
      _id: user._id,
      name: user.name,
      phone: req.body.phone,
    },
    originAdress: {
      _id: originAdress._id,
      adress: originAdress.adress,
      city: originAdress.city,
      state: originAdress.state,
      zipcode: originAdress.zipcode,
    },
    destinationAdress:{
      _id: destinationAdress._id,
      adress: destinationAdress.adress,
      city: destinationAdress.city,
      state: destinationAdress.state,
      zipcode: destinationAdress.zipcode,
    },
    datePlaced: new Date().now
  });

  await order.save();
  res.send(order);

});

router.post('/myOrder/', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.user._id);
  if(!user) return res.status(400).send('Invalid user');

  const originAdress = await Adress.findById(req.body.originAdressId);
  if(!originAdress) return res.status(400).send('Invalid originAdressId');

  const destinationAdress = await Adress.findById(req.body.destinationAdressId);
  if(!destinationAdress) return res.status(400).send('Invalid destinationAdressId');

  const dateRequired = new Date(req.body.dateScheduled);
  if(!dateRequired) return res.status(400).send("Invalid dateScheduled")


  const order = new Order({
    user:{
      _id: user._id,
      name: user.name,
      phone: req.body.phone,
    },
    originAdress: {
      _id: originAdress._id,
      adress: originAdress.adress,
      city: originAdress.city,
      state: originAdress.state,
      zipcode: originAdress.zipcode,
    },
    destinationAdress:{
      _id: destinationAdress._id,
      adress: destinationAdress.adress,
      city: destinationAdress.city,
      state: destinationAdress.state,
      zipcode: destinationAdress.zipcode,
    },
    info: req.body.info,
    dateScheduled: dateRequired,
    datePlaced: new Date().now
  });

  await order.save();
  res.send(order);

});

router.put('/:id', [auth, emp], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.body.userId);
  if(!user) return res.status(400).send('Invalid user');

  const originAdress = await Adress.findById(req.body.originAdressId);
  if(!originAdress) return res.status(400).send('Invalid originAdressId');

  const destinationAdress = await Adress.findById(req.body.destinationAdressId);
  if(!destinationAdress) return res.status(400).send('Invalid destinationAdressId');

  const order = await Order.findByIdAndUpdate(req.params.id,
    {
      user:{
        _id: user._id,
        name: user.name,
        phone: req.body.phone,
      },
      originAdress: {
        _id: originAdress._id,
        adress: originAdress.adress,
        city: originAdress.city,
        state: originAdress.state,
        zipcode: originAdress.zipcode,
      },
      destinationAdress:{
        _id: destinationAdress._id,
        adress: destinationAdress.adress,
        city: destinationAdress.city,
        state: destinationAdress.state,
        zipcode: destinationAdress.zipcode,
      }
    }, { new: true });

  if (!order) return res.status(404).send('The oreder with the given ID was not found.');

  res.send(order);
});

router.delete('/:id', [auth, admin], async (req, res) => {
  const order = await Order.findByIdAndRemove(req.params.id);

  if (!order) return res.status(404).send('The order with the given ID was not found.');

  res.send(order);
});

router.get('/specific/:id', [auth,emp,validateObjectId], async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) return res.status(404).send('The order with the given ID was not found.');

  res.send(order);
});



router.get('/myorders/', [auth], async (req, res) => {
  const user = await User.findById(req.user._id);
  if(!user) return res.status(400).send('Invalid user');

  const orders = await Order.find({"user._id": user._id});

  res.send(orders);
});

module.exports = router;
