const express = require('express');
const { authMiddleware } = require('../middlewares/multerMiddleware');
const { addEmployee } = require('../controllers/userController');
const router = express.Router();

router.post("/add", authMiddleware, addEmployee)

module.exports = router