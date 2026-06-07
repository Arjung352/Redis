const { Router } = require("express");
const router = Router();
const { getBanner, setBanner, deleteBanner } = require("../controller/banner");
router.get("/banner", getBanner);
router.post("/banner", setBanner);
router.delete("/banner", deleteBanner);
module.exports = router;
