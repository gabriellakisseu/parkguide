const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: ["p", "b", "pre"],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

module.exports.parkSchema = Joi.object({
  park: Joi.object({
    name: Joi.string().required().escapeHTML(),
    country: Joi.string().required().escapeHTML(),
    continent: Joi.string().required().escapeHTML(),
    size: Joi.number().required().min(0),
    visitors: Joi.number().min(0),
    fee: Joi.number().min(0),
    address: Joi.string().required().escapeHTML(),
    description: Joi.string().required().escapeHTML(),
    shortdesc: Joi.string().required().escapeHTML(),
    services: Joi.array().items(Joi.string()).required(),
    activities: Joi.array().items(Joi.string()).required(),
    trails: Joi.string().required().escapeHTML(),
    openhours: Joi.string().escapeHTML(),
    difficulty: Joi.string().required(),
    protection: Joi.string().escapeHTML(),
    landscape: Joi.array().items(Joi.string()).required(),
  }).required(),
  deleteImages: Joi.array(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required().escapeHTML(),
  }).required(),
});
