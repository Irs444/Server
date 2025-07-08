const express = require('express');
const { addCredit, getAllCredit } = require('../controllers/creditController');
const { authMiddleware } = require('../middlewares/multerMiddleware');
const router = express.Router();

router.post("/add", authMiddleware, addCredit)
router.get("/list", authMiddleware, getAllCredit)

module.exports = router