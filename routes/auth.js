const express = require('express');
const { registerController, loginController, currentUserController } = require('../controllers/authController');
const middleware = require('../Middleware/authMiddleware');
const router = express.Router();

// register || POST 
router.post('/register', registerController)
// Login || POST
router.post('/login', loginController)
// GET CURRENT USER
router.get('/current-user',middleware,currentUserController)

module.exports=router