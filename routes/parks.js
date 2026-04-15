const express = require("express");
const router = express.Router();
const parks = require("../controllers/parks");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAdmin, validatePark } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const Park = require("../models/park");

router
  .route("/")
  .get(catchAsync(parks.index))
  .post(
    isLoggedIn,
    isAdmin,
    upload.array("image"),
    validatePark,
    catchAsync(parks.createPark)
  );

router.get("/new", isLoggedIn, isAdmin, parks.renderNewForm);
router.delete("/:id", isLoggedIn, isAdmin, catchAsync(parks.deletePark));
router.put('/:id', isLoggedIn, isAdmin, upload.array('image'), validatePark, catchAsync(parks.updatePark));
router.route("/:id").get(catchAsync(parks.showPark));
router.get('/:id/edit', isLoggedIn, isAdmin, catchAsync(parks.renderEditForm))
router
  .route("/continent/:continent")
  .get(catchAsync(parks.showParkByContinent));
router.route("/country/:country").get(catchAsync(parks.showParkByCountry));
router.route("/trails/:difficulty").get(catchAsync(parks.showParkByDifficulty));
router.route("/attractions/:attraction").get(catchAsync(parks.showParkByAttractions));
router.route("/activities/:activity").get(catchAsync(parks.showParkByActivities));


module.exports = router;
