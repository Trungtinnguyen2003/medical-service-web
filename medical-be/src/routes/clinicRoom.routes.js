const router = require("express").Router();
const controller = require("../controllers/clinicRoom.controller");
const { verifyToken } = require("../middlewares/verifyToken");

const checkAdmin = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Chỉ admin mới được phép" });
  next();
};

router.get("/", verifyToken, checkAdmin, controller.getAll);
router.get("/:id", verifyToken, checkAdmin, controller.getOne);
router.post("/", verifyToken, checkAdmin, controller.create);
router.put("/:id", verifyToken, checkAdmin, controller.update);
router.delete("/:id", verifyToken, checkAdmin, controller.delete);

module.exports = router;
