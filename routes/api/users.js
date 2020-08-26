const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../../models/User');

// @route    POST api/users
// @desc     Registering a user
// @access   Public
router.post(
  '/',
  [
    check('name', 'Name is required!').not().isEmpty(),
    check('email', 'Enter a valid email!').isEmail(),
    check('password', 'enter a password with length 6 or more!').isLength({
      min: 6,
    }),
  ],
  async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        res.status(400).json({ errors: [{ msg: 'user already exists' }] });
      }


      const avatar = gravatar.url(email, {
        s: '200',  //size of avatar
        r: 'pg',   //filter type for avatar
        d: 'mm',   //default avatar
      });


      user = new User({
        name,
        email,
        avatar,
        password,
      });


      const salt = await bcrypt.genSalt(10);


      user.password = await bcrypt.hash(password, salt);


      await user.save();


      const payload = {
        user: {
          id: user.id
        }
      }

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: 36000
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });   //send token back to client
        });
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
    //Return JWT webToken.
  }
);

module.exports = router;




















//Registers users. Checks if user already exists. for new users it extracts the gravatar, salts and hash the password and save all details in the databse.
//usees JWT to sign the request to the middleware for authentication. sends data in payload, sets expiration, in callback it recies 
//either a token or an error. for the token it just passes it to the client. for error it displays it. 