import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CommentForm from '../components/CommentForm';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const postRes = await fetch(`/api/posts/${id}`);
        const postData = await postRes.json();
        if (!postRes.ok) throw new Error(postData.message || 'Failed to load post');
        setPost(postData);

        const commentsRes = await fetch(`/api/comments/post/${id}`);
        const commentData = await commentsRes.json();
        if (!commentsRes.ok) throw new Error(commentData.message || 'Failed to load comments');
        setComments(commentData);
      } catch (err) {
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [id]);

  const handleNewComment = (newComment) => {
    setComments((prev) => [newComment, ...prev]);
  };

  if (loading) return <p className="text-gray-500 text-center mt-6">Loading post...</p>;
  if (errorMsg) return <p className="text-red-500 text-center mt-6">{errorMsg}</p>;
  if (!post) return <p className="text-center mt-6">Post not found.</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 bg-white rounded-md shadow-sm">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-sm text-gray-500 italic mb-4">
        Author: {post.author?.name || 'Anonymous'} | Category: {post.category?.name}
      </p>

      {post.image && (
        <img
          src={`/uploads/${post.image}`}
          alt="Featured"
          className="w-full rounded-md mb-6"
        />
      )}

      <div className="mb-6 text-gray-800 leading-relaxed">
        <p>{post.content}</p>
      </div>

      <hr className="my-8" />

      <h3 className="text-xl font-semibold mb-2">Comments</h3>
      <CommentForm postId={id} onAdd={handleNewComment} />

      {comments.length === 0 ? (
        <p className="mt-4 text-gray-600">No comments yet. Be the first to share your thoughts!</p>
      ) : (
        <ul className="mt-4 space-y-6">
          {comments.map((c) => (
            <li key={c._id} className="border-b pb-4">
              <p className="text-sm text-gray-500">
                <strong>{c.author?.name}</strong> on {new Date(c.createdAt).toLocaleString()}
              </p>
              <p className="mt-1 text-gray-700">{c.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PostDetail;
