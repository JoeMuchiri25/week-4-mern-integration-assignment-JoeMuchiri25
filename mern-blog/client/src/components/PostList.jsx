import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import useApi from '../hooks/useApi';
import { fetchPostsPaginated } from '../services/api';

const PostList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const currentPage = Number(searchParams.get('page')) || 1;

  const { data, loading, error, load } = useApi(() =>
    fetchPostsPaginated(currentPage, searchTerm, selectedCategory)
  );

  useEffect(() => {
    load();

    fetch('/api/categories')
      .then((res) => res.json())
      .then(setCategories)
      .catch(() => setCategories([]));
  }, [currentPage, searchTerm, selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ search: searchTerm, category: selectedCategory, page: '1' });
  };

  const handlePageChange = (page) => {
    setSearchParams({
      search: searchTerm,
      category: selectedCategory,
      page: page.toString(),
    });
  };

  const posts = data?.posts ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="max-w-4xl mx-auto mt-6 px-4">
      <form onSubmit={handleSearchSubmit} className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Filter
        </button>
      </form>

      {loading && <p className="text-gray-500">Loading posts...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {posts.map((post) => (
        <div key={post._id} className="mb-8 p-4 border rounded-md shadow-sm">
          <h2 className="text-xl font-bold text-blue-700 hover:underline">
            <Link to={`/post/${post._id}`}>{post.title}</Link>
          </h2>
          <p className="text-sm italic text-gray-600">
            Category: {post.category?.name || 'Uncategorized'} | Author: {post.author?.name || 'Anonymous'}
          </p>
          <p className="mt-2 text-gray-700">{post.content.slice(0, 150)}...</p>
        </div>
      ))}

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Prev
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default PostList;
