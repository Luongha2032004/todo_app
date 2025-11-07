const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // optional email field — some existing deployments may have a unique index on `email`.
  // We keep it optional and will populate a placeholder on register to avoid duplicate-key errors
  email: { type: String },
});

module.exports = mongoose.model("User", UserSchema);
