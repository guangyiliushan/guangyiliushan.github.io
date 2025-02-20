import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto p-4">
        <Outlet />
      </main>
      <footer className="bg-gray-100 py-4 text-center">
        © 2024 My Blog. All rights reserved.
      </footer>
    </div>
  )
}
