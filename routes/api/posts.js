const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const auth = require('../../middlewares/auth');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');


// @route  POST api/posts
// @desc   Add Post
// @access Private
router.post('/', [auth,
    [
        check('text', 'text is required')
            .not()
            .isEmpty()
    ]
],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const user = await User.findById(req.user.id).select('-password');

            const newPost = new Post({
                text: req.body.text,
                name: user.name,
                user: req.user.id,
                avatar: user.avatar,

            });

            const post = await newPost.save();

            res.json(post);
        } catch (err) {
            console.error(err.message);
            res.status(400).send('Server Error');
        }
    });

// @route  GET api/posts
// @desc   Get all posts
// @access Private
router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(400).send('Server Error');
    }
});

// @route  GET api/posts/:id
// @desc   Get posts by id
// @access Private
router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).sort({ date: -1 });

        if (!post) {
            return res.status(400).json({ msg: 'No posts found' });
        }
        res.json(post);
    } catch (err) {
        console.error(err.message);

        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'No posts available yet' });
        }
        res.status(400).send('Server Error');
    }
});

// @route  DELETE api/posts/:id
// @desc   Delete posts by id
// @access Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(400).json({ msg: 'Post not found' });
        }

        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }


        await post.remove();

        res.json({ msg: 'Post Removed' });
    } catch (err) {
        console.error(err.message);

        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'No posts available yet' });
        }
        res.status(400).send('Server Error');
    }
});


// @route  Put api/posts/like/:id
// @desc   Like a post
// @access Private
router.get('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: 'Post already liked.' })
        }
        post.likes.unshift({ user: req.user.id });   //params.id- liked id.  user.id- id logged in that likes params id

        await post.save();

        res.json(post.likes);

    } catch (err) {
        console.error(err.message);
        res.status(400).send('Server Error');
    }
});


// @route  PUT api/posts/unlike/:id
// @desc   Remove a like
// @access Private
//pass post id input
//this will automatically remove the current logged in users like due to it's structure
router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ msg: 'Post has not been liked yet' });
        }

        const removeIndex = post.likes
            .map(like => like.user.toString())
            .indexOf(req.user.id);

        post.likes.splice(removeIndex, 1);

        await post.save();

        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        res.status(400).send('Server Error');
    }
});

// @route  Put api/posts/comment/:id
// @desc   Like a post
// @access Private
router.put('/comment/:id', [auth,
    [
        check('text', 'Comment text is required')
            .not()
            .isEmpty()
    ]
],
    async (req, res) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ erros: errors.array() });
        }

        try {
            const post = await Post.findById(req.params.id);
            const user = await User.findById(req.user.id).select('-password');

            if (!post) {
                return res.status(400).json({ msg: 'Comment not found' });
            }

            const obj = {
                user: req.user.id,
                text: req.body.text,
                name: user.name,
                avatar: user.avatar
            }

            post.comments.unshift(obj);

            await post.save();

            res.json(post.comments);

        } catch (err) {
            console.error(err.message);

            if (err.kind === 'ObjectId') {
                return res.status(400).json({ msg: 'Comment not found' });
            }
            res.status(400).send('Server Error');
        }
    });

// @route  PUT api/posts/uncomment/:id
// @desc   Remove a like
// @access Private

router.delete('/uncomment/:id/:comment_id', auth, async (req, res) => {
    try {

        //Pulll the Post
        const post = await Post.findById(req.params.id);


        //Pull the comments
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);

        //Make sure the comments exists
        if (!comment) {
            return res.status(400).json({ msg: 'Comment does not exist' });
        }

        //Check user
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        //Get remove index
        const removeIndex = post.comments
            .map(comment => comment.user.toString())
            .indexOf(req.user.id);

        //Remove one occurance of index
        post.comments.splice(removeIndex, 1);

        await post.save();

        res.json(post.comments);

    }
    catch (err) {
        console.error(err.message);
        res.status(400).send('Server Error');
    }
});
module.exports = router;
