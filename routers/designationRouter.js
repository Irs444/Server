const express = require('express');
const { authMiddleware } = require('../middlewares/multerMiddleware');
const { addDesignation, getAllDesignation } = require('../controllers/designationController');
const router = express.Router();

router.post("/add", authMiddleware, addDesignation)
router.get("/list", authMiddleware, getAllDesignation)

module.exports = router