import express from 'express';
import Comment from '../models/Comment.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// Get comments for a post
router.get('/post/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'name')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch {
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
});

// Create a comment
router.post('/post/:postId', protect, async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ message: 'Comment content required' });

  try {
    const comment = await Comment.create({
      content,
      author: req.user._id,
      post: req.params.postId,
    });

    const populated = await comment.populate('author', 'name');
    res.status(201).json(populated);
  } catch {
    res.status(500).json({ message: 'Failed to create comment' });
  }
});

// Delete a comment
router.delete('/:id', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch {
    res.status(500).json({ message: 'Failed to delete comment' });
  }
});

export default router;
