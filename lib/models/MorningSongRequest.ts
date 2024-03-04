import mongoose, { Schema } from "mongoose";

const songSchema = new Schema({
  songTitle: {
    type: String,
    required: true,
  },
  singer: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  studentNumber: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Define the schema for the morning song request grouped by date
const morningSongRequestSchema = new Schema({
  date: {
    type: String,
    required: true,
  },
  requests: [songSchema], // Array of morning song requests
});

const MorningSongRequestModel =
  mongoose.models.MorningSongRequestModel ||
  mongoose.model(
    "morning-song-request",
    morningSongRequestSchema,
    "morning-song-requests"
  );

export default MorningSongRequestModel;
