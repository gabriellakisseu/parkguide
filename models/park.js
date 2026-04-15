const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } };

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

const ParkSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    images: [ImageSchema],
    continent: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    description: {
      type: String,
      required: true,
    },
    shortdesc: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    services: [String],
    activities: [String],
    trails: String,
    openhours: String,
    difficulty: String,
    fee: Number,
    protection: String,
    visitors: Number,
    landscape: [String],
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  opts
);

ParkSchema.virtual("properties.popUpMarkup").get(function () {
  return `<strong><a href="/parks/${this._id}">${this.name}</a></strong>
  <p>${this.shortdesc.substring(0, 50)}...</p>`;
});

ParkSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Park", ParkSchema);
