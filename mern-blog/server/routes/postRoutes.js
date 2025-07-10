import express from 'express';
import Post from '../models/Post.js';
import protect from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// 📄 Get all posts with pagination, search, and category filtering
router.get('/', async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = 5;
  const skip = (page - 1) * limit;

  const { search, category } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
    ];
  }

  if (category) {
    query.category = category;
  }

  try {
    const totalPosts = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .populate('category', 'name')
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
});

// 📝 Create a new post (with image upload)
router.post('/', protect, upload.single('image'), async (req, res) => {
  const { title, content, category } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!title || !content || !category) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const post = await Post.create({
      title,
      content,
      category,
      author: req.user._id,
      image,
    });

    const populated = await post.populate('author', 'name');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create post' });
  }
});

// 🔍 Get a single post by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('category', 'name')
      .populate('author', 'name');

    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch post' });
  }
});

export default router;
