const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload"); // bạn đã có

router.post("/image", upload.single("avatar"), (req, res) => {
  const url = `/uploads/${req.file.filename}`;
  res.json({ url });
});

module.exports = router;
