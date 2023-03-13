const express = require("express");
const homeController = require("../controllers/Home");
const aboutUsController = require("../controllers/AboutUs");
const contactController = require("../controllers/Contact");
const router = express.Router();

router.get("/home", homeController);
router.get("/about-us", aboutUsController);
router.get("/contact", contactController);
module.exports = router;