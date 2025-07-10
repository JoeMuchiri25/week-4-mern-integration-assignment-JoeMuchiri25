const API_BASE = '/api';

export const fetchPosts = async () => {
  const res = await fetch(`${API_BASE}/posts`);
  if (!res.ok) throw new Error('Failed to load posts');
  return await res.json();
};

export const fetchPostsPaginated = async (page = 1, search = '', category = '') => {
  const params = new URLSearchParams();
  params.append('page', page);
  if (search) params.append('search', search);
  if (category) params.append('category', category);

  const res = await fetch(`/api/posts?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch filtered posts');
  return res.json();
};


export const createPost = async (data) => {
  const res = await fetch(`${API_BASE}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Post creation failed');
  return await res.json();
};

// You can expand this with getPostById, updatePost, deletePost etc.
