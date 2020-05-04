const {Adress} = require('../models/adress');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {User} = require('../models/user');
const {Employee, validate} = require('../models/employee')
const mongoose = require('mongoose');
const express = require('express');
const validateObjectId = require('../middleware/validateObjectId');

const router = express.Router();


router.get('/', [auth, admin], async (req, res) => {
  const emplyees = await Employee.find().sort('lastName');
  res.send(emplyees);
});

router.post('/', [auth,admin], async (req, res) => {
  const {error} = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.body.userId);
  if(!user) return res.status(400).send('Invalid user');



  const emp = await Employee.findOne({"homeAdress.userId": req.body.userId.toString()});
  if(emp) return res.status(400).send("That user is already registered as an employee");





  const employee = new Employee({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      homeAdress: {
          adress: req.body.adress,
          zipcode: req.body.zipcode,
          state: req.body.state,
          city: req.body.city,
          userId: req.body.userId
      },
      phone: req.body.phone
  });

  user.isEmployee = true;

  await user.save();

  await employee.save();
  res.send(employee);

});

router.put('/:id', [auth, admin, validateObjectId], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.body.userId);
  if(!user) return res.status(400).send('Invalid user');


  const employee = await Employee.findByIdAndUpdate(req.params.id,
    {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      homeAdress: {
        adress: req.body.adress,
        zipcode: req.body.zipcode,
        state: req.body.state,
        city: req.body.city,
        userId: req.body.userId
      },
      userId: req.body.userId,
      phone: req.body.phone
    }, { new: true });

  if (!employee) return res.status(404).send('The employee with the given ID was not found.');

  res.send(employee);
});

router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
  const employee = await Employee.findByIdAndRemove(req.params.id);

  if (!employee) return res.status(404).send('The employee with the given ID was not found.');

  res.send(employee);
});

router.get('/me', auth, async (req, res) => {
  const employee = await Employee.find({"homeAdress.userId": req.user._id})
  res.send(employee);
});


router.get('/:id', [auth,admin,validateObjectId], async (req, res) => {
  const employee = await Employee.findById(req.params.id);

  if (!employee) return res.status(404).send('The employee with the given ID was not found.');

  res.send(employee);
});


module.exports = router;
