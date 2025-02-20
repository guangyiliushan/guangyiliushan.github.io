import { useQuery } from '@apollo/client'
import { GET_POSTS } from '../queries/blog'
import { Link } from 'react-router-dom'
const mockData = {
    posts: [{
      id: "1",
      title: "测试文章标题",
      excerpt: "这是文章摘要内容...",
      createdAt: new Date().toISOString()
    }],
    totalPosts: 1
  }

export default function BlogListPage() {
  const { loading, error, data } = useQuery(GET_POSTS, {
    variables: { page: 1, perPage: 10 }
  })

  if (loading) return <div>加载文章列表中...</div>
  if (error) return <div>加载失败: {error.message}</div>

  return (
    <div className="space-y-4">
      {data?.posts.map(post => (
        <article 
          key={post.id}
          className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <Link to={`/blogs/${post.id}`}>
            <h2 className="text-2xl font-semibold text-gray-800">{post.title}</h2>
            <p className="mt-2 text-gray-600">{post.excerpt}</p>
            <time className="block mt-3 text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleDateString()}
            </time>
          </Link>
        </article>
      ))}
    </div>
  )
}
