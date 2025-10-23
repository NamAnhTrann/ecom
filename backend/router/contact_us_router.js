const express = require("express");
const router = express.Router();
const contactController = require("../controller/contact_us_controller");

router.get("/get/all/contact/api", contactController.listAllContacts);
router.get("/get/single/contact/api/:id/", contactController.listSingleContact);
router.post('/post/contact/api', contactController.addContact);

module.exports = router;
