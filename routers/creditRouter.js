const express = require('express');
const { addCredit } = require('../controllers/creditController');
const { authMiddleware } = require('../middlewares/multerMiddleware');
const router = express.Router();

router.post("/add", authMiddleware, addCredit)

module.exports = router