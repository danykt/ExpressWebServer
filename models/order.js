const Joi = require('joi');
const mongoose = require('mongoose');
const moment = require('moment');
const {adressSchema} = require('./adress');

const orderSchema = new mongoose.Schema({
  user: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
      },
      phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
      }
    }),
    required: true
  },
  originAdress:  {
    type: new mongoose.Schema({
      adress: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
      },
      zipcode: {
        type: String,
        required: true,
        min: 5,
        max: 30
      },
      state:{
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
      },
      city:{
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30
      }
    }),
    required: true
  },
  destinationAdress:  {
      type: new mongoose.Schema({
        adress: {
          type: String,
          required: true,
          minlength: 5,
          maxlength: 255
        },
        zipcode: {
          type: String,
          required: true,
          min: 5,
          max: 30
        },
        state:{
          type: String,
          required: true,
          minlength: 2,
          maxlength: 50
        },
        city:{
          type: String,
          required: true,
          minlength: 2,
          maxlength: 30
        }
      }),
      required: true
    },
  dateScheduled:{
    type: Date,
    required: true
  },
  datePlaced: {
    type: Date,
    required: true,
    default: Date.now
  },
  dateDelivered: {
    type: Date,
    required: false
  },
  amount: {
    type: Number,
    required: false,
    default: 0.0
  },
  assignedSchedule:{
    type: String,
    required: false,
    default: null
  },
  isAssigned:{
    type: Boolean,
    default: false
  },
  isDelivered:{
    type: Boolean,
    default: false
  },
  isPaid:{
    type: Boolean,
    default: false
  },
  info:{
    type: String,
    maxlength: 500
  }
});




const Order = mongoose.model('Order', orderSchema);

function validateOrder(order) {
  const schema = {
    originAdressId: Joi.objectId().required(),
    destinationAdressId: Joi.objectId().required(),
    phone: Joi.string().min(7).max(20).required(),
    dateScheduled: Joi.date().required(),
    userId: Joi.objectId(),
    info: Joi.string().min(10).required()
  };

  return Joi.validate(order, schema);
}

exports.Order = Order;
exports.validate = validateOrder;
