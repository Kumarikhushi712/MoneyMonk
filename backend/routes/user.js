const router = require('express').Router();
const { check } = require('express-validator');
const { registerUser, loginUser } = require('../controllers/user');

router.post('/register', 
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        // check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
    ],
    registerUser
);

router.post('/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists(),
    ],
    loginUser
);

module.exports = router;