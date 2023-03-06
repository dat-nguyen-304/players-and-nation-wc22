const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const playerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
      required: true,
    },
    nation: {
      type: Schema.Types.ObjectId,
      ref: 'nations',
    },
    club: {
      type: String,
      enum: ['Arsenal', 'Manchester United', 'Chelsea', 'Manchester City', 'PSG', 'Inter Milan', 'Real Madrid', 'Barcelona '],
      required: true,
    },
    position: {
      type: String,
      enum: ['GK', 'RB', 'LB', 'CB', 'LM', 'RM', 'CM', 'ST '],
      required: true,
    },
    goals: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    isCaptain: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

var Players = mongoose.model("players", playerSchema);

module.exports = Players;
