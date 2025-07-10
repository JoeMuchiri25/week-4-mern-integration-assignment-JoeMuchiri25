import Category from '../models/Category.js';

export const createCategory = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  const exists = await Category.findOne({ name });
  if (exists) {
    return res.status(409).json({ message: 'Category already exists' });
  }

  const category = await Category.create({ name });
  res.status(201).json(category);
};

export const getCategories = async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.json(categories);
};
