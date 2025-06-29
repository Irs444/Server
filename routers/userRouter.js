const express = require('express');
const { authMiddleware } = require('../middlewares/multerMiddleware');
const { addEmployee, login } = require('../controllers/userController');
const router = express.Router();

router.post('/add', authMiddleware, addEmployee)
router.post('/login', login)

module.exports = router