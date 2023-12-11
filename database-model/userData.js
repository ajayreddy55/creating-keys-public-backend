const mongoose = require("mongoose");

const { Schema, model } = mongoose;
const crypto = require("crypto");
const mongooseLeanGetters = require("mongoose-lean-getters");

const algorithm = "aes-256-cbc";

const encrypt = (text) => {
  text = text.toString();
  const ivBufferFrom = Buffer.from(process.env.IV);
  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(process.env.ENCRYPT_KEY),
    ivBufferFrom
  );
  let encryptedName = cipher.update(text, "utf-8", "hex");
  encryptedName += cipher.final("hex");
  const ivStr = ivBufferFrom.toString("hex");
  const ivNameStr = ivStr + ":" + encryptedName;
  return ivNameStr;
};

const decrypt = (text) => {
  if (!text) {
    return text;
  }

  try {
    const ivText = text.split(":");

    const ivDe = Buffer.from(ivText[0], "hex");

    const decipher = crypto.createDecipheriv(
      algorithm,
      Buffer.from(process.env.ENCRYPT_KEY),
      ivDe
    );

    const decrypt = decipher.update(ivText[1], "hex", "utf-8");
    decrypt += decipher.final("utf-8");

    return decrypt.toString();
  } catch (error) {
    return text;
  }
};

const userDataSchema = new Schema(
  {
    name: {
      type: String,
      set: encrypt,
      get: decrypt,
    },
    email: {
      type: String,
      set: encrypt,
      get: decrypt,
    },
  },
  {
    versionKey: false,
    toObject: { getters: true, setters: true },
    toJSON: { getters: true, setters: true },
    runSettersOnQuery: true,
  }
);

userDataSchema.plugin(mongooseLeanGetters);

const userDataModel = model("userData", userDataSchema);

module.exports = userDataModel;
