const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

// Get posts
router.get('/', async (req, res) => {
    try {
        const dbPostData = await Post.findAll({
            attributes: [
                'id',
                'content',
                'title',
                'date_created'
            ],
            include: [
                {
                    model: User,
                    attributes: ['username'],
                },
            ],
        });

        const posts = dbPostData.map((post) => post.get({ plain: true}));

        res.render('homepage', {
            ...posts,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// A route for a single post with it's comments associated
router.get('/post/:id', withAuth, async (req, res) => {
    try {
        const dbPostData = await Post.findbyPk(req.params.id, {
            include: [
                {
                    model: Comment,
                    attributes: ['comment', 'date_created'],
                    include: {
                        model: User,
                        attributes: ['username']
                    }
                },
                {
                    model: User,
                    attributes: ['username']
                }
            ]
        });
        const post = dbPostData.get({ plain: true });

        res.render('post', {
            ...post,
            logged_in: req.session.logged_in,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// login route
router.get('/login', async (req, res) => {
    if(req.session.logged_in) {
        res.redirect('/');
        return;
    }

    res.render('login');
});

// sign-up route
router.get('/signup', async (req, res) => {
    if(req.session.logged_in) {
        res.redirect('/');
        return;
    }

    res.render('sign-up');
});


module.exports = router;