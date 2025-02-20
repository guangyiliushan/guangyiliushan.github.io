import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">
          My Blog
        </Link>
        <div className="ml-8 flex space-x-6">
          <NavLink to="/">首页</NavLink>
          <NavLink to="/blogs">博客</NavLink>
          <NavLink to="/about">关于</NavLink>
        </div>
      </div>
    </nav>
  )
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="text-gray-600 hover:text-blue-600 transition-colors"
    >
      {children}
    </Link>
  )
}
