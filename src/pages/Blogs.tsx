import { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, User, Search, ChevronUp, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuthStore } from '../store/authStore';
import { upvoteBlogPost, recordBlogView, getBlogPostsWithUserInteractions } from '../api/blogs';
import { BlogPost } from '../types';
import { FullPageLoading } from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

// Import the static content from the generated JSON file
import allContent from '../data/content.json';

// The static content is the primary source of truth for what blogs exist.
const staticBlogContent: any[] = allContent.blog || [];

const categories = [
  'All',
  'Writing Tips',
  'Research',
  'Portfolio',
  'Financial Aid',
  'Interview Prep',
];

export default function Blogs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  // Fetches dynamic data from Firestore and merges it into the static blog list.
  const fetchAndMergeBlogData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const baseBlogPosts: BlogPost[] = staticBlogContent.map(post => ({
      ...post,
      upvotes: 0,
      views: 0,
      hasUpvoted: false,
    }));

    const userId = isAuthenticated && user ? user.id : undefined;
    
    const { data: dynamicData, error: apiError } = await getBlogPostsWithUserInteractions(userId);

    if (apiError) {
      setError(apiError.message || "Failed to load upvote and view counts.");
      setBlogPosts(baseBlogPosts);
      setIsLoading(false);
      return;
    }

    if (dynamicData) {
      const dynamicDataMap = new Map<string, BlogPost>(
        dynamicData.map(post => [post.id, post])
      );

      const mergedPosts = baseBlogPosts.map(staticPost => {
        const dynamicPost = dynamicDataMap.get(staticPost.id);
        if (dynamicPost) {
          return {
            ...staticPost,
            upvotes: dynamicPost.upvotes,
            views: dynamicPost.views,
            hasUpvoted: dynamicPost.hasUpvoted || false,
          };
        }
        return staticPost;
      });
      setBlogPosts(mergedPosts);
    } else {
      setBlogPosts(baseBlogPosts);
    }
    
    setIsLoading(false);
  }, [user, isAuthenticated]);

  useEffect(() => {
    fetchAndMergeBlogData();
  }, [fetchAndMergeBlogData]);

  const handleUpvote = async (postId: string) => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }

    const originalBlogPosts = [...blogPosts];
    const updatedBlogPosts = blogPosts.map((post) =>
      post.id === postId
        ? {
            ...post,
            upvotes: post.hasUpvoted ? post.upvotes - 1 : post.upvotes + 1,
            hasUpvoted: !post.hasUpvoted,
          }
        : post
    );
    setBlogPosts(updatedBlogPosts);
    
    if (selectedPost && selectedPost.id === postId) {
        setSelectedPost(updatedBlogPosts.find(p => p.id === postId) || null);
    }

    const { error: upvoteError } = await upvoteBlogPost(user.id, postId);
    if (upvoteError) {
      console.error('Error upvoting blog post:', upvoteError);
      setError("Failed to save your upvote. Please try again.");
      setBlogPosts(originalBlogPosts);
    }
  };

  // FIX: Simplified view handling logic
  const handlePostClick = async (post: BlogPost) => {
    setSelectedPost(post);

    // Optimistically update the UI view count immediately for a snappy feel.
    const updatedPosts = blogPosts.map(p => 
      p.id === post.id ? { ...p, views: p.views + 1 } : p
    );
    setBlogPosts(updatedPosts);
    
    // Call the simplified API function in the background.
    // This no longer requires the user's ID.
    await recordBlogView(post.id);
  };

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (post.tags && post.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    const matchesCategory =
      selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return <FullPageLoading message="Loading blog posts..." />;
  }

  if (selectedPost) {
    const currentPostData = blogPosts.find(p => p.id === selectedPost.id) || selectedPost;

    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => setSelectedPost(null)}
            className="mb-6 text-teal-600 hover:text-teal-700 font-medium"
          >
            ← Back to all posts
          </button>
          <article className="bg-white rounded-lg shadow-sm overflow-hidden">
            {currentPostData.imageUrl && (
              <img
                src={currentPostData.imageUrl}
                alt={currentPostData.title}
                className="w-full h-64 object-cover"
              />
            )}
            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <User className="w-4 h-4 mr-1" /> {currentPostData.author}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(currentPostData.publishedDate)}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" /> {currentPostData.readTime}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="flex items-center text-sm text-gray-600">
                    <Eye className="w-4 h-4 mr-1" />
                    {currentPostData.views.toLocaleString()} views
                  </span>
                  <button
                    onClick={() => handleUpvote(currentPostData.id)}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-md transition-colors ${
                      currentPostData.hasUpvoted
                        ? 'bg-teal-100 text-teal-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <ChevronUp className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {currentPostData.upvotes}
                    </span>
                  </button>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {currentPostData.title}
              </h1>
              <div className="flex flex-wrap gap-2 mb-6">
                {currentPostData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-teal-50 text-teal-800 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: currentPostData.content }} />
              </div>
            </div>
          </article>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <ErrorMessage
            message={error}
            variant="error"
            onDismiss={() => setError(null)}
            className="mb-6"
          />
        )}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Scholarship Success Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Expert tips, strategies, and insights to help you win scholarships
            and fund your education
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handlePostClick(post)}
            >
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <span className="bg-teal-50 text-teal-800 px-2 py-1 rounded text-xs font-medium">
                    {post.category}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" /> {post.readTime}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <span className="flex items-center">
                    <User className="w-3 h-3 mr-1" /> {post.author}
                  </span>
                  <span>{formatDate(post.publishedDate)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className="flex items-center">
                      <Eye className="w-3 h-3 mr-1" />
                      {post.views.toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpvote(post.id);
                    }}
                    className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                      post.hasUpvoted
                        ? 'bg-teal-100 text-teal-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <ChevronUp className="w-3 h-3" /> <span>{post.upvotes}</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
        {filteredPosts.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No articles found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search terms or category filter to find what
              you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
