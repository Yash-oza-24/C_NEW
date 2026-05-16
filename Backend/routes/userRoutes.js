const { createUser, loginUser } = require('../controllers/userController');
const router = require('express').Router();

router.post('/register', createUser);
router.post('/login', loginUser);

module.exports = router;