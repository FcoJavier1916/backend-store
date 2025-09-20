const express = require('express');
const router = express.Router();
const { userController } = require('../../controllers/index');
const authMiddleware = require('../../middlewares/authMiddleware');

router.post('/login', userController.loginUser);

router.post(
  '/register',
  authMiddleware(['superadmin']),
  userController.resgisterUser
);

module.exports = router;