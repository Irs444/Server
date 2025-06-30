const express = require('express');
const { authMiddleware } = require('../middlewares/multerMiddleware');
const { addEmployee, login, forgetPassword, resetPassword } = require('../controllers/userController');
const router = express.Router();

router.post('/add', authMiddleware, addEmployee)
router.post('/login', login)
router.post('/forget-password', forgetPassword)
router.post('/reset-password', resetPassword)

module.exports = router