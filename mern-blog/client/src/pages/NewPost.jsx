import PostForm from '../components/PostForm';

const NewPost = () => {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Create New Post</h1>
      <PostForm />
    </main>
  );
};

export default NewPost;
