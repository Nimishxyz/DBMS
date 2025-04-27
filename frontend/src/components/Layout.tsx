import { Outlet, Link, useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import {
  BookOpen,
  DollarSign,
  LogOut,
  User,
  LayoutDashboard
} from 'lucide-react'

export function Layout() {
  const navigate = useNavigate()
  
  return (
    <div className="min-h-screen bg-black bg-opacity-95">
      {/* Ambient background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      <nav className="sticky top-0 z-50 border-b border-white/10 bg-zinc-900/70 backdrop-blur-xl shadow-lg">
        <div className="container flex h-16 items-center px-4 md:px-8">
          <div className="flex items-center space-x-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-blue-300 to-purple-400 bg-clip-text text-transparent">
              Library System
            </h2>
            <div className="flex items-center space-x-1">
              <Link to="/">
                <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-purple-500/10 transition-all">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/books">
                <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-purple-500/10 transition-all">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Books
                </Button>
              </Link>
              <Link to="/fines">
                <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-purple-500/10 transition-all">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Fines
                </Button>
              </Link>
            </div>
          </div>
          <div className="ml-auto flex items-center space-x-2">
            <Button
              variant="ghost"
              className="text-gray-400 hover:text-white hover:bg-purple-500/10 transition-all"
              onClick={() => navigate('/profile')}
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </Button>
            <Button
              variant="ghost"
              className="text-gray-400 hover:text-white hover:bg-red-500/10 transition-all"
              onClick={() => {
                localStorage.clear()
                navigate('/login')
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="flex-1 container py-8 px-4 relative z-10">
        <Outlet />
      </main>

      <footer className="border-t border-white/10 py-6 bg-zinc-900/50 backdrop-blur-xl relative z-10">
        <div className="container text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Library Management System
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Empowering knowledge through digital library management
          </p>
        </div>
      </footer>
    </div>
  )
}