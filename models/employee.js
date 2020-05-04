const Joi = require('joi');
const mongoose = require('mongoose');
const {adressSchema} = require('./adress');


const employeeSchema = new mongoose.Schema({
  firstName:{
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50

  },
  lastName:{
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50

  },
  homeAdress: {
    type: adressSchema,
    required: true
  },
  phone:{
    type: String,
    required: true,
    min: 10,
    max: 100
  }


});


const Employee = mongoose.model('Employee', employeeSchema)

function validateEmployee(employee){
  const schema = {
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    adress: Joi.string().min(5).max(255).required(),
    zipcode: Joi.string().min(5).max(30).required(),
    state: Joi.string().min(2).max(50).required(),
    city: Joi.string().min(2).max(30).required(),
    userId: Joi.objectId().required(),
    phone: Joi.string().min(10).max(100).required()

  };
  return Joi.validate(employee, schema);

};

exports.Employee = Employee;
exports.validate = validateEmployee;
