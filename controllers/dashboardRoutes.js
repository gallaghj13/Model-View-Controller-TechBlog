const router = require('express').Router();
const { Post, User, Comment} = require('../models');
const withAuth = require('../utils/auth');

// Find All posts made by the logged in User
router.get('/', withAuth, async (req, res) => {
    try {
        const postData = await Post.findAll({
            where: {
                user_id = req.session.user_id
            },
            attributes: [
                'id',
                'content',
                'title',
                'date_created'
            ],
            include: [
                {
                    model: Comment,
                    attributes: ['id', 'comment', 'post_id', 'user_id', 'date_created'],
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
        })
        const posts = postData.map((post) => post.get({ plain: true }));

        res.render('dashboard', { posts, logged_in: true});
    } catch (err) {
        res.status(500).json(err);
    }
});

// Create Post Page
router.get('/newPost', withAuth, (req, res) => {
    res.render('new-post');
});

// Edit post page
router.get('/edit/:id', withAuth, (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id, {
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
        const post = postData.get({ plain: true });

        res.render('edit-post', {
            ...post,
            logged_in: req.session.logged_in,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});