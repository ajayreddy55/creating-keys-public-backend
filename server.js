const express = require("express");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");

const crypto = require("crypto");

const app = express();
app.use("/uploads", express.static("public"));
app.use(cors());

mongoose
  .connect(
    "mongodb+srv://ajayreddy6753:Ajay6753@ajayreddycluster.1x5u1ub.mongodb.net/encryptedData2?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB Connected"))
  .catch((error) => console.log(error));

app.use(express.json());
app.use("/api", require("./routes/apiRoutes.js"));

const port = process.env.PORT || 5005;

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
