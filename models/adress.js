const Joi = require('joi');
const mongoose = require('mongoose');

const adressSchema = new mongoose.Schema({
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
  },
  googleCoordinates: {
    type: String,
    required: false,
    min: 0,
    default: "0",
    max: 1000
  },
  userId: {
    type: String,
    required: true,
    min: 10,
    max: 100
  }
});

const Adress = mongoose.model('Adresses', adressSchema);


function validateAdress(adress) {
  const schema = {
    adress: Joi.string().min(5).max(255).required(),
    zipcode: Joi.string().min(5).max(30).required(),
    state: Joi.string().min(2).max(50).required(),
    city: Joi.string().min(2).max(30).required(),
  };

  return Joi.validate(adress, schema);
}

exports.adressSchema = adressSchema;
exports.Adress = Adress;
exports.validate = validateAdress;
