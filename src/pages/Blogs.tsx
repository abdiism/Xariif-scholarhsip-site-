import { useState, useEffect } from 'react'
import {
  Calendar,
  Clock,
  User,
  Search,
  Tag,
  ChevronUp,
  Eye,
} from 'lucide-react'
import Header from '../components/Header'
import { useAuthStore } from '../store/authStore'
import {
  getBlogPostsWithUserInteractions,
  upvoteBlogPost,
  recordBlogView,
} from '../api/blogs'
import { BlogPost } from '../types'
import LoadingSpinner, { FullPageLoading } from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Top 10 Tips for Writing a Winning Scholarship Essay',
    excerpt:
      'Learn how to craft compelling scholarship essays that stand out from the crowd and increase your chances of success.',
    content:
      'Writing a scholarship essay can be daunting, but with the right approach, you can create a compelling narrative that showcases your unique strengths...',
    author: 'Sarah Johnson',
    publishedDate: '2024-01-15',
    readTime: '7 min read',
    category: 'Writing Tips',
    tags: ['Essay Writing', 'Scholarships', 'Tips'],
    imageUrl:
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    upvotes: 142,
    views: 1523,
    hasUpvoted: false,
    isPublished: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'How to Research and Find Hidden Scholarship Opportunities',
    excerpt:
      'Discover lesser-known scholarship databases and strategies to uncover funding opportunities that others miss.',
    content:
      'While many students focus on popular scholarship platforms, the real gems are often found in unexpected places...',
    author: 'Michael Chen',
    publishedDate: '2024-01-12',
    readTime: '5 min read',
    category: 'Research',
    tags: ['Research', 'Opportunities', 'Strategy'],
    imageUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    upvotes: 89,
    views: 967,
    hasUpvoted: false,
    isPublished: true,
    createdAt: '2024-01-12',
    updatedAt: '2024-01-12',
  },
  {
    id: '3',
    title: 'Building a Strong Academic Portfolio for Scholarship Applications',
    excerpt:
      'Learn how to organize and present your academic achievements, extracurriculars, and experiences effectively.',
    content:
      'A well-organized academic portfolio can make the difference between a successful and unsuccessful scholarship application...',
    author: 'Dr. Emily Rodriguez',
    publishedDate: '2024-01-10',
    readTime: '8 min read',
    category: 'Portfolio',
    tags: ['Portfolio', 'Academic', 'Organization'],
    imageUrl:
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    upvotes: 156,
    views: 2103,
    hasUpvoted: true,
    isPublished: true,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10',
  },
  {
    id: '4',
    title:
      'Understanding Different Types of Financial Aid: Grants vs Scholarships',
    excerpt:
      'A comprehensive guide to understanding the various forms of financial aid available to students.',
    content:
      'Navigating the world of financial aid can be confusing. Understanding the differences between grants, scholarships, and other forms of aid is crucial...',
    author: 'Financial Aid Team',
    publishedDate: '2024-01-08',
    readTime: '6 min read',
    category: 'Financial Aid',
    tags: ['Financial Aid', 'Grants', 'Education'],
    imageUrl:
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    upvotes: 73,
    views: 834,
    hasUpvoted: false,
    isPublished: true,
    createdAt: '2024-01-08',
    updatedAt: '2024-01-08',
  },
  {
    id: '5',
    title: 'Interview Tips: Acing Your Scholarship Interview',
    excerpt:
      'Master the art of scholarship interviews with our comprehensive guide to preparation and presentation.',
    content:
      'Scholarship interviews can be nerve-wracking, but proper preparation can help you present your best self...',
    author: 'Lisa Thompson',
    publishedDate: '2024-01-05',
    readTime: '9 min read',
    category: 'Interview Prep',
    tags: ['Interviews', 'Preparation', 'Communication'],
    imageUrl:
      'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    upvotes: 128,
    views: 1456,
    hasUpvoted: false,
    isPublished: true,
    createdAt: '2024-01-05',
    updatedAt: '2024-01-05',
  },
]
const categories = [
  'All',
  'Writing Tips',
  'Research',
  'Portfolio',
  'Financial Aid',
  'Interview Prep',
]

export default function Blogs() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    loadBlogPosts()
  }, [user])

  const loadBlogPosts = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const { data: posts, error: blogError } =
        await getBlogPostsWithUserInteractions(user?.id)
      if (blogError) {
        setError(blogError.message)
        setBlogPosts(mockBlogPosts)
      } else if (posts) {
        setBlogPosts(posts)
      } else {
        setBlogPosts(mockBlogPosts)
      }
    } catch (err: any) {
      console.error('Error loading blog posts:', err)
      setError('Failed to load blog posts')
      setBlogPosts(mockBlogPosts)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpvote = async (postId: string) => {
    if (!isAuthenticated || !user) {
      alert('Please sign in to upvote posts')
      return
    }

    setBlogPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              upvotes: post.hasUpvoted ? post.upvotes - 1 : post.upvotes + 1,
              hasUpvoted: !post.hasUpvoted,
            }
          : post
      )
    )

    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost((prev) =>
        prev
          ? {
              ...prev,
              upvotes: prev.hasUpvoted ? prev.upvotes - 1 : prev.upvotes + 1,
              hasUpvoted: !prev.hasUpvoted,
            }
          : null
      )
    }

    try {
      await upvoteBlogPost(user.id, postId)
    } catch (error) {
      console.error('Error upvoting blog post:', error)
      loadBlogPosts() // Reload data to ensure consistency
    }
  }

  const handlePostClick = async (post: BlogPost) => {
    setSelectedPost(post)
    if (isAuthenticated && user) {
      try {
        await recordBlogView(user.id, post.id)
      } catch (error) {
        console.error('Error recording blog view:', error)
      }
    }
  }

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
    const matchesCategory =
      selectedCategory === 'All' || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (isLoading) {
    return <FullPageLoading message="Loading blog posts..." />
  }

  if (selectedPost) {
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
            {selectedPost.imageUrl && (
              <img
                src={selectedPost.imageUrl}
                alt={selectedPost.title}
                className="w-full h-64 object-cover"
              />
            )}
            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <User className="w-4 h-4 mr-1" /> {selectedPost.author}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />{' '}
                    {formatDate(selectedPost.publishedDate)}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" /> {selectedPost.readTime}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="flex items-center text-sm text-gray-600">
                    <Eye className="w-4 h-4 mr-1" />{' '}
                    {selectedPost.views.toLocaleString()} views
                  </span>
                  <button
                    onClick={() => handleUpvote(selectedPost.id)}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-md transition-colors ${
                      selectedPost.hasUpvoted
                        ? 'bg-teal-100 text-teal-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <ChevronUp className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {selectedPost.upvotes}
                    </span>
                  </button>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {selectedPost.title}
              </h1>
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedPost.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-teal-50 text-teal-800 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="prose max-w-none">
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  {selectedPost.excerpt}
                </p>
                <p className="text-gray-700 leading-relaxed">
                  {selectedPost.content}
                </p>
                {/* Extended content for demo */}
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                  Key Strategies
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  When applying for scholarships, it's essential to understand
                  that each application is unique. Tailoring your approach to
                  match the specific requirements and values of each
                  scholarship organization significantly increases your chances
                  of success.
                </p>
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                  Research is Key
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Before you even begin writing, spend time researching the
                  organization offering the scholarship. Understanding their
                  mission, values, and previous recipients can provide valuable
                  insights into what they're looking for in successful
                  applicants.
                </p>
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                  Tell Your Story
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Your personal story is what sets you apart from other
                  applicants. Focus on experiences that have shaped your goals
                  and demonstrate your commitment to your field of study or
                  career path.
                </p>
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
        
        {/* --- THIS IS THE CORRECTED PART --- */}
        {error && (
          <ErrorMessage
            message={error}
            variant="error"
            onDismiss={() => setError(null)}
            className="mb-6"
          />
        )}
        
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Scholarship Success Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Expert tips, strategies, and insights to help you win scholarships
            and fund your education
          </p>
        </div>
        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
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
            {/* Category Filter */}
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
        {/* Blog Posts Grid */}
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
                      <Eye className="w-3 h-3 mr-1" />{' '}
                      {post.views.toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleUpvote(post.id)
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
                <div className="flex flex-wrap gap-1 mt-3">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                  {post.tags.length > 2 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      +{post.tags.length - 2}
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
        {/* No Results */}
        {filteredPosts.length === 0 && (
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