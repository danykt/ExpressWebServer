const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const emp = require('../middleware/emp');
const {Employee} = require('../models/employee');
const {Order} = require('../models/order')
const {Schedule, validate} = require('../models/schedule')
const mongoose = require('mongoose');
const express = require('express');
const validateObjectId = require('../middleware/validateObjectId');

const router = express.Router();


router.get('/', [auth, emp], async (req, res) => {
  const schedules = await Schedule.find();
  res.send(schedules);
});




router.get('/users/'), [auth], async (req,res) =>{
  const employee = await Employee.findById(req.body.userId);
  if(!employee) return res.status(404).send("The user with given id was not found");

  const schedules = await Schedule.find({"employeeInfo._id": req.body.userId});
  res.send(schedules);
}

router.patch('/deleteOrderFromSchedule/:id', [auth, admin], async(req,res) =>{

  const schedule = await Schedule.findById(req.params.id);
  const order = await Order.findById(req.body.orderId);



  if (!schedule) return res.status(404).send('The schedule with the given ID was not found.');
  if(!order) return res.status(404).send('The order with the given ID was not found');
  if(order.isDelivered) return res.status(404).send('The order has been delivered');

  const orderInSchedule = schedule.scheduledOrders.id(order._id);

  if(!orderInSchedule) return res.status(404).send('This order is not assigned to this schedule');

  await orderInSchedule.remove();

  order.isAssigned = false;
  order.assignedSchedule = null;
  await order.save();

  await schedule.save();

  res.send(schedule);

});

router.patch('/deleteManyOrdersFromSchedule/:id', [auth, admin], async(req,res) =>{

  const schedule = await Schedule.findById(req.params.id);
  if (!schedule) return res.status(404).send('The schedule with the given ID was not found.');

  let order;
  for(var i=0; i< req.body.orders.length; i++){
    order = await Order.findById(req.body.orders[i]);

    const orderInSchedule = schedule.scheduledOrders.id(req.body.orders[i]);
    if(orderInSchedule != null){
      await orderInSchedule.remove();

      order.isAssigned = false;
      await order.save();
    }


  }



  await schedule.save();

  res.send(schedule);




});

router.patch('/insertManyOrdersInSchedule/:id', [auth, admin], async(req,res) =>{

  const schedule = await Schedule.findById(req.params.id);
  if (!schedule) return res.status(404).send('The schedule with the given ID was not found.');

  let order;
  var ordersNotFound = [];
  for(var i=0; i< req.body.orders.length; i++){
    order = await Order.findById(req.body.orders[i]);
    if(!order){
      ordersNotFound.push(req.body.orders[i]);
    }else{
      if(!order.isAssigned){
        schedule.scheduledOrders.push({
          _id: order._id,
          clientName: order.user.name,
          clientPhone: order.user.phone,
          info: order.info,
          spefications: req.body.spefications
        });
        order.isAssigned = true;
        await order.save();
        await schedule.save();
      }
  }
  }
  await schedule.save();
  if(ordersNotFound.length === 0){

    res.send(schedule);
  }else{

    res.send(ordersNotFound);

  }



});

router.patch('/assignOrderToSchedule/:id', [auth, admin], async(req,res) =>{

  const schedule = await Schedule.findById(req.params.id);
  const order = await Order.findById(req.body.orderId);



  if (!schedule) return res.status(404).send('The schedule with the given ID was not found.');
  if(!order) return res.status(404).send('The order with the given ID was not found');
  if(order.isDelivered) return res.status(404).send("The order has already been delivered");

  const orderInSchedule = schedule.scheduledOrders.id(order._id);

  if(orderInSchedule) return res.status(404).send('This order has already been assign to this schedule');

  schedule.scheduledOrders.push({
    _id: order._id,
    clientName: order.user.name,
    clientPhone: order.user.phone,
    info: order.info,
    spefications: req.body.spefications
  });

  order.isAssigned = true;
  order.assignedSchedule = schedule._id;
  await order.save();

  await schedule.save();

  res.send(schedule);

});


router.delete('/:id', [auth, admin], async (req, res) => {
  const schedule = await Schedule.findByIdAndRemove(req.params.id);

  if (!schedule) return res.status(404).send('The schedule with the given ID was not found.');

  res.send(schedule);
});


router.post('/', [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const employee = await Employee.findById(req.body.empId);
  if(!employee) return res.status(400).send('Invalid employee');




  const schedule = new Schedule({
    employeeInfo:{
      _id: employee._id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      phone: employee.phone
    },
    scheduleDate: req.body.scheduleDate

  });

  await schedule.save();
  res.send(schedule);

});



module.exports = router;
