const { seeker } = require("../controllers/seeker");

const { Router } = require("express");
const router = Router();

router.get("/:kind/:object", seeker);

module.exports = router;
