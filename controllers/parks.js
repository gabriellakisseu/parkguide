const Park = require("../models/park");
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.renderNewForm = (req, res) => {
  res.render("parks/new");
};

module.exports.index = async (req, res) => {
  const parks = await Park.find({});
  const visitedParks = await Park.find().sort({ visitors: -1 }).limit(6);
  res.render("parks/index", { parks, visitedParks });
};

module.exports.createPark = async (req, res, next) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.park.address,
      limit: 1,
    })
    .send();
  const park = new Park(req.body.park);
  park.geometry = geoData.body.features[0].geometry;
  park.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  await park.save();
  req.flash("success", "Successfully created a new park!");
  res.redirect("/parks");
};

module.exports.showPark = async (req, res) => {
  const park = await Park.findById(req.params.id).populate({
    path: "reviews",
    populate: { path: "author rating" },
  });
  if (!park) {
    req.flash("error", "Cannot find that national park!");
    return res.redirect("/parks");
  }
  res.render("parks/show", { park });
};

module.exports.showParkByContinent = async (req, res) => {
  const { continent } = req.params;
  const parks = await Park.find({ continent: continent });
  if (parks.length === 0) {
    req.flash("error", "Cannot find national park in that continent!");
    return res.redirect("/parks");
  }

  res.render("parks/continent", { parks, continent });
};

module.exports.showParkByCountry = async (req, res) => {
  const { country } = req.params;
  const parks = await Park.find({ country: country });
  if (parks.length === 0) {
    req.flash("error", "Cannot find national park in that country!");
    return res.redirect("/parks");
  }

  res.render("parks/country", { parks, country });
};

module.exports.showParkByAttractions = async (req, res) => {
  const { attraction } = req.params;
  const parks = await Park.find({ landscape: attraction });
  if (parks.length === 0) {
    req.flash("error", "Cannot find national park with this attraction!");
    return res.redirect("/parks");
  }

  res.render("parks/attractions", { parks, attraction });
};

module.exports.showParkByActivities = async (req, res) => {
  const { activity } = req.params;
  const parks = await Park.find({ activities: activity });
  if (parks.length === 0) {
    req.flash("error", "Cannot find national park with this activity!");
    return res.redirect("/parks");
  }

  res.render("parks/activities", { parks, activity });
};

module.exports.showParkByDifficulty = async (req, res) => {
  const { difficulty } = req.params;
  const parks = await Park.find({ difficulty: difficulty });
  if (parks.length === 0) {
    req.flash("error", "Cannot find national park with trails of this difficulty!");
    return res.redirect("/parks");
  }

  res.render("parks/trails", { parks, difficulty });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
    const park = await Park.findById(id)
    if (!park) {
        req.flash('error', 'Cannot find that park!');
        return res.redirect('/parks');
    }
    res.render('parks/edit', { park });
};

module.exports.deletePark = async (req, res) => {
  const { id } = req.params;
  await Park.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted this park')
  res.redirect('/parks');
}

module.exports.updatePark = async (req, res) => {
  const { id } = req.params;
  const park = await Park.findByIdAndUpdate(id, { ...req.body.park });
  const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
  park.images.push(...imgs);
  await park.save();
  req.flash('success', 'Successfully updated the national park!');
  res.redirect(`/parks/${park._id}`)
}
