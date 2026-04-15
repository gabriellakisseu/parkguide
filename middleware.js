const ExpressError = require("./utils/ExpressError");
const { parkSchema, reviewSchema } = require("./schema");
const Park = require("./models/park");
const Review = require("./models/review");
const User = require("./models/user");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash(
      "error",
      "If you want to write a review, you must be logged in first!"
    );
    return res.redirect("/login");
  }
  next();
};

module.exports.isAdmin = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user.isAdmin) {
    req.flash(
      "error",
      "You do not have permission to create a new park! Please log in as admin!"
    );
    return res.redirect("/login");
  }
  next();
};

module.exports.validatePark = (req, res, next) => {
  const { error } = parkSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to delete this review!");
    return res.redirect(`/parks/${id}`);
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join("");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
