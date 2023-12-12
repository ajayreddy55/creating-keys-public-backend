const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const userDataModel = require("../database-model/userData");
const algorithm = "aes-256-cbc";
const iv = crypto.randomBytes(16);

const router = express.Router();

router.get("/keys", (request, response) => {
  const keys = crypto.generateKeyPairSync("rsa", {
    modulusLength: 1024,
    publicExponent: 0x10201,
    publicKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs1",
      format: "pem",
      cipher: "aes-256-cbc",
      passphrase: "secret keys",
    },
  });

  console.log(keys.publicKey);
  console.log(keys.privateKey);

  //   const publicKeyObject = crypto.createPublicKey(keys.publicKey);
  //   console.log(publicKeyObject);
  //   publicKeyObject.export({ type: "pkcs1", format: "pem" });
  //   console.log(publicKeyObject);
});

router.get("/get-otp", (request, response) => {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < 6; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return response.status(200).json({ otp: otp });
});

router.post("/send-api", async (request, response) => {
  const { api } = request.body;

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASSWORD,
    },
  });

  const message = {
    from: '"Fred Foo 👻" <foo@example.com>',
    to: "bar@example.com, baz@example.com",
    subject: "api",
    text: api,
    html: `<a href=${api} target="__blank">${api}</a>`,
  };

  const messageRes = transporter
    .sendMail(message)

    .then((messageRes) => {
      return response.status(200).json({
        message: "Mail Sent",
        msgId: messageRes.messageId,
        preview: nodemailer.getTestMessageUrl(messageRes),
      });
    })
    .catch((error) => {
      return response.status(500).json({ message: error });
    });
});

const storage = multer.diskStorage({
  destination: function (request, file, cb) {
    return cb(null, "./public/images");
  },
  filename: function (request, file, cb) {
    return cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const uploadFile = multer({ storage });

router.post("/upload/files", uploadFile.single("file"), (request, response) => {
  try {
    console.log(request.file.filename);
    return response.status(200).json({ fileName: request.file.filename });
  } catch (error) {
    return response.status(500).json({ message: error.message });
  }
});

router.get("/download/:name", (request, response) => {
  const path =
    "C:/Users/lenovo/Documents/react js tasks/tasks react/backend task create/backend/" +
    "/public/images/" +
    request.params.name;
  const fileNewName = `${Date.now()}_${request.params.name}.png`;
  response.download(path, fileNewName, (error) => {
    if (error) {
      return response.status(500).json({ message: "Could not download file" });
    }
  });
});

router.post("/save-encrypted-data", async (request, response) => {
  try {
    const { name, email } = request.body;

    const user = new userDataModel({
      name: name,
      email: email,
    });

    await user.save();

    return response.status(200).json({ message: "Data Saved Successfully" });
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ message: error.message });
  }
});

router.get("/get-user-data", async (request, response) => {
  try {
    const data = await userDataModel.find();
    return response.status(200).json({ data: data });
  } catch (error) {
    return response.status(500).json({ message: error.message });
  }
});

module.exports = router;
