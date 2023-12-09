const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const userDataSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  iv: {
    type: String,
  },
});

const userDataModel = model("userData", userDataSchema);

module.exports = userDataModel;
