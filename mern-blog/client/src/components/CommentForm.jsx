import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const CommentForm = ({ postId, onAdd }) => {
  const { token } = useAuth();
  const [content, setContent] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!content.trim()) return setErrorMsg('Comment cannot be empty');

    try {
      setLoading(true);
      const res = await fetch(`/api/comments/post/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to post comment');

      onAdd(data); // 🔁 Notify parent to re-render
      setContent('');
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-2">
      {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your comment..."
        rows={3}
        className="w-full p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <button
        type="submit"
        disabled={loading}
        className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Posting...' : 'Add Comment'}
      </button>
    </form>
  );
};

export default CommentForm;
