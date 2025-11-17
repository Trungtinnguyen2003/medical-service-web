// src/routes/patient_profile.routes.js

const router = require("express").Router();
const controller = require("../controllers/patient_profile.controller");
const { verifyToken } = require("../middlewares/verifyToken");

// CRUD hồ sơ bệnh nhân
router.get("/my-profiles", verifyToken, controller.getMyProfiles);
router.post("/", verifyToken, controller.createProfile);
router.put("/:id", verifyToken, controller.updateProfile);
router.delete("/:id", verifyToken, controller.deleteProfile);

module.exports = router;
