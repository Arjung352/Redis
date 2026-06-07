const { Router } = require("express");
const router = Router();
const { getBanner } = require("../controller/banner");
router.get("/banner", getBanner);
module.exports = router;
