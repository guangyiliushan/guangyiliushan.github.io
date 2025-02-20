import { createBrowserRouter } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/Home'
import BlogListPage from './pages/BlogList'
import BlogDetailPage from './pages/BlogDetail'
import AboutPage from './pages/About'
import NotFound from './pages/NotFound'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'blogs', element: <BlogListPage /> },
      { path: 'blogs/:id', element: <BlogDetailPage /> },
      { path: 'about', element: <AboutPage /> }
    ]
  },
  {
    path: 'blogs/:id',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <BlogDetailPage />
      </Suspense>
    )
  },
  {
    path: 'blogs',
    children: [
      { index: true, element: <BlogListPage /> },
      { 
        path: ':id',
        element: <BlogDetailPage />,
      },
      {
        path: 'drafts', // 访问路径 /blogs/drafts
        element: <DraftListPage />,
      }
    ]
  }
])
