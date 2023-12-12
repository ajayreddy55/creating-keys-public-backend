const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const encrypt = require("mongoose-encryption");

const userDataSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
});

const secretKey = "mongo-db-top-secret-key-for-data";

userDataSchema.plugin(encrypt, {
  secret: secretKey,
  encryptedFields: ["name", "email"],
});

const userDataModel = model("userData", userDataSchema);

module.exports = userDataModel;
