if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const userRoutes = require("./routes/users");
const parkRoutes = require("./routes/parks");
const reviewRoutes = require("./routes/reviews");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const dbUrl = process.env.DB_URL;

mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("Database connected!");
  })
  .catch((err) => {
    console.log("Connection Error!!!");
    console.log(err);
  });

const app = express();
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const secret = process.env.SECRET;

app.use(
  session({
    secret: secret,
    saveUninitialized: true,
    resave: false,
    store: MongoStore.create({
      collectionName: "session",
      mongoUrl: dbUrl,
      ttl: 24 * 60 * 60,
      autoRemove: "native",
    }),
  })
);

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", userRoutes);
app.use("/parks", parkRoutes);
app.use("/parks/:id/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(statusCode).render("error", { err });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listenning on port ${port}`);
});
