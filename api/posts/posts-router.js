const express = require('express')
const Post = require('./posts-model')

const router = express.Router() 


router.get('/', (req, res) => {
  Post.find(req.query)
    .then(posts => {
      res.status(200).json(posts)
    })
    .catch(err => {
      res.status(500).json({ 
        message: "The posts information could not be retrieved",
        err: err.message, 
        })
    })
})

router.get('/:id', (req, res) => {
  const {id} = req.params

  Post.findById(id)
    .then(post => {
      if (!post) {
        res.status(404).json({ message: "The post with the specified ID does not exist" })
      } else {
        res.status(200).json(post)
      }
    })
    .catch(err => {
      res.status(500).json({ 
        message: "The post information could not be retrieved",
        err: err.message     
        })
    })
})

router.post('/', (req, res) => {
    const { title, contents } = req.body 
    if (!title || !contents) {
        res.status(400).json({
            message: "Please provide title and contents for the post",
        })
    } else {
        Post.insert({ title, contents })
            .then(({ id }) => {
                return Post.findById(id)
            })
            .then(post => {
                res.status(201).json(post)
            })
            .catch(err => {
                res.status(500).json({
                    message: "There was an error while saving the post to the database",
                    err: err.message,
                })
            })
    }
})

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { title, contents } = req.body;
  
    if (!title || !contents) {
      return res.status(400).json({ message: "Please provide title and contents for the post" });
    }
    Post.findById(id)
      .then(post => {
        if (!post) {
          return res.status(404).json({ message: "The post with the specified ID does not exist" });
        }
  
        Post.update(id, { title, contents })
          .then(updatedCount => {
            if (updatedCount > 0) {
              return Post.findById(id);
            } else {
              throw new Error("The post information could not be modified");
            }
          })
                .then(updatedPost => {
                    res.status(200).json(updatedPost);
                  })
                  .catch(err => {
                    res.status(500).json({ message: err.message });
                  });
              })
              .catch(err => {
                res.status(500).json({ message: "The post information could not be retrieved", err: err.message });
              });
          });

router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            res.status(404).json({
                message: "The post with the specified ID does not exist",
            })
        } else {
            await Post.remove(req.params.id)
            res.json(post)
        }
    } catch (err) {
        res.status(500).json({
            message: "The post could not be removed",
            err: err.message
        })
    }
})

router.get('/:id/comments', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
           res.status(404).json({
            message: "The post with the specified ID does not exist",
           }) 
        } else {
            const messages = await Post.findPostComments(req.params.id)
            res.json(messages)
        }
    } catch (err) {
        res.status(500).json({
            message: "The comments information could not be retrieved",
            err: err.message,
            stack: err.stack,
        })
    }
})


module.exports = router