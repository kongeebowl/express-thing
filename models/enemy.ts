const mongoose = require("mongoose");
const { Schema } = mongoose;

const enemySchema = new Schema({
  name: String,
  description: String,
  monsters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Monster" }],
  connectedLocations: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
  ],
});

enemySchema.index({ location: "2dsphere" });

const Enemy = mongoose.model("Enemy", enemySchema);

module.exports = Enemy;
