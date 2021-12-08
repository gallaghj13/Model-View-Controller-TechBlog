const router = require('express').Router();
const { Post, User, Comment} = require('../../models');
const withAuth = require('../../utils/auth');

// Get All Posts
router.get('/', async (req,res) => {
    try {
        const postData = await Post.findAll({
           order: [['date_created', 'DESC']],
           include: [
               {
                   model: Comment,
                   include: {
                       model: User, 
                       attributes: ['username']
                   }
               },
               {
                   model: User,
                   attributes: ['username']
               },
           ],
        });
        res.status(200).json(postData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get Post by ID
router.get('/:id', async (req, res) => {
    try {
      const postData = await Post.findByPk(req.params.id, {
        include: [
            {
                model: Comment,
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
  
      if (!postData) {
        res.status(404).json({ message: 'No post found with this id!' });
        return;
      }
  
      res.status(200).json(postData);
    } catch (err) {
      res.status(500).json(err);
    }
  });

// Create Post
router.post('/', withAuth, async (req, res) => {
    try {
        const post = await Post.create({
            title: req.body.title,
            content: req.body.content,
            user_id: req.session.user_id
        });
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json(err);
    }
});

// update a post
router.put('/edit/:id', withAuth, async (req, res) => {
    try {
        const postData = await Post.update({
            title: req.body.title,
            content: req.body.content
        },
            {
                where: {
                    id: req.params.id
                }
            }
        );
        res.status(200).json(postData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// delete a post
router.delete('/:id', async (req, res) => {
    try {
      const postData = await Post.destroy({
        where: {
          id: req.params.id,
          user_id: req.session.user_id,
        },
      });
  
      if (!postData) {
        res.status(404).json({ message: 'No post found with this id!' });
        return;
      }
  
      res.status(200).json(postData);
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = router;