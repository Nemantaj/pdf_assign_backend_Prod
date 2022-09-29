const express = require("express");
const formController = require("../controller/form.controller");

const router = express.Router();

router.get("/get-contact", formController.getContacts);
router.get("/get-pdf/:entryId", formController.getPDF);
router.post("/post-contact", formController.postContact);
router.post("/retrieve-contacts", formController.retrieveContacts);
router.post("/get-all-pdf", formController.getPDFAll);

module.exports = router;
