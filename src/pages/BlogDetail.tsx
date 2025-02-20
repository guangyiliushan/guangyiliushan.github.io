import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { GET_POST } from '../queries/blog'

interface PostData {
  post: {
    title: string
    content: string
    createdAt: string
    author: {
      name: string
    }
  }
}

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { loading, error, data } = useQuery<PostData>(GET_POST, {
    variables: { id },
    skip: !id
  })

  if (!id) return <div>无效的文章ID</div>
  if (loading) return <div>加载中...</div>
  if (error) return <div>加载失败：{error.message}</div>

  return (
    <article className="prose max-w-3xl">
      <header className="mb-8">
        <h1 className="text-4xl font-bold">{data?.post.title}</h1>
        <div className="mt-4 text-gray-600">
          <span>作者：{data?.post.author.name}</span>
          <time className="ml-4">
            {new Date(data?.post.createdAt).toLocaleDateString()}
          </time>
        </div>
      </header>
      <section 
        className="article-content" 
        dangerouslySetInnerHTML={{ __html: data?.post.content || '' }}
      />
    </article>
  )
}
