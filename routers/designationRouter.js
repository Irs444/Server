const express = require('express');
const { authMiddleware } = require('../middlewares/multerMiddleware');
const { addDesignation } = require('../controllers/designationController');
const router = express.Router();

router.post("/add", authMiddleware, addDesignation)

module.exports = router