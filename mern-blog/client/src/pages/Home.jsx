import PostList from '../components/PostList';

const Home = () => {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">All Blog Posts-Health</h1>
      <PostList />
    </main>
  );
};

export default Home;
