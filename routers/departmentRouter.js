const express = require('express');
const { authMiddleware } = require('../middlewares/multerMiddleware');
const { addDepartment } = require('../controllers/departmentController');
const router = express.Router();

router.post("/add", authMiddleware, addDepartment)

module.exports = router