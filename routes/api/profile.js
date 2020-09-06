const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const auth = require('../../middlewares/auth');
const { check, validationResult } = require('express-validator/check');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');
const { reset } = require('nodemon');


// @route  GET api/profile/me
// @desc   Get profile of user logged in
// @access Private 
//outgoing, private and therefore auth in middle
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate(
            'user',
            ['name', 'avatar']
        );
        if (!profile) {
            return res.status(400).json({ msg: "There is no profile for the user." });
        }
        res.json(profile);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error')
    }
});

// @route  POST api/profile
// @desc   Create or Update user profile
// @access Private

router.post('/', [auth,
    [
        check('status', 'Status is required')
            .not()
            .isEmpty(),
        check('skills', 'Skills are required')
            .not()
            .isEmpty()
    ]
],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {
            company,
            website,
            location,
            status,
            skills,
            bio,
            githubusername,
            twitter,
            facebook,
            instagram,
            youtube,
            linkedin
        } = req.body;


        //Build profile object
        const profileFeilds = {};

        profileFeilds.user = req.user.id;
        if (company) profileFeilds.company = company;
        if (website) profileFeilds.website = website;
        if (bio) profileFeilds.bio = bio;
        if (location) profileFeilds.location = location; status
        if (status) profileFeilds.status = status;
        if (githubusername) profileFeilds.githubusername = githubusername;
        if (skills) {
            profileFeilds.skills = skills.split(",")
                .map(skill => skill.trim());
        }
        //Build social object
        profileFeilds.social = {}
        if (twitter) profileFeilds.social.twitter = twitter;
        if (facebook) profileFeilds.social.facebook = facebook;
        if (instagram) profileFeilds.social.instagram = instagram;
        if (youtube) profileFeilds.social.youtube = youtube;
        if (linkedin) profileFeilds.social.linkedin = linkedin;

        try {
            let profile = await Profile.findOne({ user: req.user.id });
            if (profile) {
                //update
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFeilds },
                    { new: true }
                );

                return res.json(profile);
            }


            //Create
            profile = new Profile(profileFeilds);

            await profile.save();
            res.json(profile);

        } catch (err) {
            console.log(err.message);
            res.sendStatus(400).send('Server Error');
        }
    });

// @route  GET api/profile/
// @desc   Get all profiles
// @access Public

router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.sendStatus(400).send('Server Error');
    }
});

// @route  GET api/profile/users/:user_id
// @desc   Get specific user profiles
// @access Public

router.get('/user/:userId', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.userId }).populate('user', ['name', 'avatar']);

        if (!profile) {
            return res.status(400).json({ msg: 'Profile not found!' });
        }

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found!' });
        }
        res.status(400).send('Server Error');
    }
});


// @route    DELETE api/profile
// @desc     Delete profile, user & posts
// @access   Private
router.delete('/', auth, async (req, res) => {
    try {
        // Remove user posts
        await Post.deleteMany({ user: req.user.id });
        // Remove profile
        await Profile.findOneAndRemove({ user: req.user.id });
        // Remove user
        await User.findOneAndRemove({ _id: req.user.id });

        res.json({ msg: 'User deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    PUT api/profile/experience
// @desc     Add profile experience
// @access   Private
router.put(
    '/experience',
    [
        auth,
        [
            check('title', 'Title is required').not().isEmpty(),
            check('company', 'Company is required').not().isEmpty(),
            check('from', 'From date is required and needs to be from the past')
                .not()
                .isEmpty()
                .custom((value, { req }) => (req.body.to ? value < req.body.to : true))
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body;

        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        };

        try {
            const profile = await Profile.findOne({ user: req.user.id });

            profile.experience.unshift(newExp);

            await profile.save();

            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

//@route  DELETE api/profile/experience/:exp_id
//@desc   Deletes the experience based in Id
//@access Private

router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

        profile.experience.splice(removeIndex, 1);

        await profile.save();

        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route    PUT api/profile/education
// @desc     Add profile education
// @access   Private
router.put(
    '/education',
    [
        auth,
        [
            check('school', 'School is required').not().isEmpty(),
            check('degree', 'Degree is required').not().isEmpty(),
            check('fieldofstudy', 'Field of study is required').not().isEmpty(),
            check('from', 'From date is required and needs to be from the past')
                .not()
                .isEmpty()
                .custom((value, { req }) => (req.body.to ? value < req.body.to : true))
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        } = req.body;

        const newEdu = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        };

        try {
            const profile = await Profile.findOne({ user: req.user.id });

            profile.education.unshift(newEdu);

            await profile.save();

            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

//@route  DELETE api/profile/education/:edu_id
//@desc   Deletes the education based in Id
//@access Private

router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);

        profile.education.splice(removeIndex, 1);

        await profile.save();

        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

//@route  GET api/profile/github/:username
//@desc   Get user repos from Github
//@access Public

router.get('/github/:username', async (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${
                req.params.username
                }/repos?per_page=5&sort=created:asc&client_id=${
                config.get('githubClientId')
                }&client_secret=${'githubSecret'}`,
            method: 'GET',
            headers: { 'user-agent': 'node.js' }
        };


        request(options, (error, response, body) => {

            if (error) {
                console.log(error);
            }

            if (response.statusCode !== 200) {
                return res.status(404).json({ msg: 'No Github profile found' });
            }

            res.json(JSON.parse(body));
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
module.exports = router;
