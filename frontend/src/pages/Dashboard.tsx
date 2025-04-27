import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import axios from '../lib/axios'
import { BookOpen, DollarSign, BookCopy, Clock, TrendingUp, ArrowUpRight, LibraryBig, BookMarked, Sparkles } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Link } from 'react-router-dom'

interface BorrowedBook {
  issue_id: number
  title: string
  author: string
  issue_date: string
  due_date: string
}

interface Stats {
  total_borrowed: number
  current_borrowed: number
  total_fines: number
}

export function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    total_borrowed: 0,
    current_borrowed: 0,
    total_fines: 0
  })
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([])
  const userId = localStorage.getItem('userId')
  const [isLoading, setIsLoading] = useState(true)

  const fetchStats = async () => {
    try {
      const response = await axios.get(`/api/users/${userId}/stats`)
      console.log("Stats response:", response.data)
      // Check if response.data is the stats object directly
      if (response.data) {
        setStats(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch user stats:', error)
    }
  }

  const fetchBorrowedBooks = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`/api/books/borrowed/${userId}`)
      console.log("Borrowed books response:", response.data)
      // Check if response.data is an array directly
      if (Array.isArray(response.data)) {
        setBorrowedBooks(response.data)
      } else if (response.data && Array.isArray(response.data.books)) {
        setBorrowedBooks(response.data.books)
      }
    } catch (error) {
      console.error('Failed to fetch borrowed books:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
    fetchBorrowedBooks()
  }, [userId])

  // Calculate if any books are overdue
  const hasOverdueBooks = borrowedBooks.some(book => new Date(book.due_date) < new Date())

  return (
    <div className="space-y-8 animate-in fade-in duration-500 bg-black bg-opacity-95 min-h-screen p-6">
      {/* Hero section with glass effect */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg border border-purple-500/20 backdrop-blur-md bg-zinc-900/60">
        <div className="absolute -top-40 -right-20 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-20 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="relative p-8 md:p-10 z-10">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-purple-600/30 to-blue-600/30 backdrop-blur-lg flex items-center justify-center mb-6 border border-white/10 shadow-lg shadow-purple-500/10">
            <Sparkles className="h-8 w-8 md:h-10 md:w-10 text-purple-300" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-purple-300 via-white to-blue-300 bg-clip-text text-transparent mb-4">
            Your Library Dashboard
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl p-4 rounded-xl border border-white/10 bg-black/20 backdrop-blur-lg shadow-inner">
            Welcome back to your library dashboard. Track your books, manage returns, and stay on top of your reading journey.
          </p>
          
          <div className="mt-8 flex flex-wrap gap-4 items-center">
            <Link to="/books">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl px-6 py-2 h-auto text-base font-medium shadow-lg shadow-purple-900/20 border border-white/10">
                Browse Books
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            {hasOverdueBooks && (
              <div className="px-4 py-2 rounded-xl bg-red-900/30 text-red-300 text-sm font-medium flex items-center gap-2 border border-red-500/20 backdrop-blur-md shadow-lg shadow-red-900/10">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                You have overdue books
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Statistics overview - Glass effect cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-zinc-900/60 backdrop-blur-md border-purple-500/20 shadow-lg hover:shadow-purple-600/10 transition-shadow duration-300 rounded-xl overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-transparent group-hover:from-purple-600/10 transition-all duration-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
            <CardTitle className="text-base font-medium text-gray-200 flex items-center">
              <BookMarked className="h-4 w-4 mr-2 text-purple-400" />
              Currently Borrowed
            </CardTitle>
            <div className="p-2 rounded-lg bg-purple-600/20 backdrop-blur-md border border-purple-500/30">
              <BookOpen className="h-4 w-4 text-purple-300" />
            </div>
          </CardHeader>
          <CardContent className="pt-2 relative z-10">
            <div className="text-4xl font-bold text-white">
              {stats.current_borrowed}
            </div>
            <div className="flex items-center gap-2 mt-2 text-gray-400">
              <BookMarked className="h-3 w-3 text-purple-400" />
              <p className="text-sm">Books currently in possession</p>
            </div>
          </CardContent>
        </Card>

        {/* Second Card */}
        <Card className="bg-zinc-900/60 backdrop-blur-md border-blue-500/20 shadow-lg hover:shadow-blue-600/10 transition-shadow duration-300 rounded-xl overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent group-hover:from-blue-600/10 transition-all duration-500"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
            <CardTitle className="text-base font-medium text-gray-200 flex items-center">
              <BookCopy className="h-4 w-4 mr-2 text-blue-400" />
              Total Books Borrowed
            </CardTitle>
            <div className="p-2 rounded-lg bg-blue-600/20 backdrop-blur-md border border-blue-500/30">
              <BookCopy className="h-4 w-4 text-blue-300" />
            </div>
          </CardHeader>
          <CardContent className="pt-2 relative z-10">
            <div className="text-4xl font-bold text-white">
              {stats.total_borrowed}
            </div>
            <div className="flex items-center gap-2 mt-2 text-gray-400">
              <TrendingUp className="h-3 w-3 text-blue-400" />
              <p className="text-sm">Books borrowed over time</p>
            </div>
          </CardContent>
        </Card>

        {/* Third Card */}
        <Card className={`bg-zinc-900/60 backdrop-blur-md border-${stats.total_fines > 0 ? 'red' : 'emerald'}-500/20 shadow-lg hover:shadow-${stats.total_fines > 0 ? 'red' : 'emerald'}-600/10 transition-shadow duration-300 rounded-xl overflow-hidden group`}>
          <div className={`absolute inset-0 bg-gradient-to-br from-${stats.total_fines > 0 ? 'red' : 'emerald'}-600/5 to-transparent group-hover:from-${stats.total_fines > 0 ? 'red' : 'emerald'}-600/10 transition-all duration-500`}></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
            <CardTitle className={`text-base font-medium text-gray-200 flex items-center`}>
              <DollarSign className={`h-4 w-4 mr-2 text-${stats.total_fines > 0 ? 'red' : 'emerald'}-400`} />
              Total Fines
            </CardTitle>
            <div className={`p-2 rounded-lg bg-${stats.total_fines > 0 ? 'red' : 'emerald'}-600/20 backdrop-blur-md border border-${stats.total_fines > 0 ? 'red' : 'emerald'}-500/30`}>
              <DollarSign className={`h-4 w-4 text-${stats.total_fines > 0 ? 'red' : 'emerald'}-300`} />
            </div>
          </CardHeader>
          <CardContent className="pt-2 relative z-10">
            <div className={`text-4xl font-bold ${stats.total_fines > 0 ? 'text-red-300' : 'text-white'}`}>
              ${stats.total_fines.toFixed(2)}
            </div>
            <div className="flex items-center gap-2 mt-2 text-gray-400">
              <ArrowUpRight className={`h-3 w-3 text-${stats.total_fines > 0 ? 'red' : 'emerald'}-400`} />
              <p className="text-sm">Outstanding fines to be paid</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Currently borrowed books - Glass effect */}
      <Card className="bg-zinc-900/60 backdrop-blur-md border-purple-500/20 shadow-lg rounded-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-purple-600/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-600/10 rounded-full blur-2xl"></div>
        <CardHeader className="border-b border-white/5 relative z-10">
          <CardTitle className="flex items-center gap-3 text-lg font-semibold text-white">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-md border border-white/10 shadow-inner">
              <Clock className="h-5 w-5 text-purple-300" />
            </div>
            Currently Borrowed Books
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 relative z-10">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl border border-white/10 p-4 animate-pulse space-y-4 bg-zinc-800/40 backdrop-blur-md">
                  <div className="h-5 bg-zinc-700 rounded-md w-3/4"></div>
                  <div className="h-4 bg-zinc-700 rounded-md w-1/2"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-8 bg-zinc-700 rounded-md"></div>
                    <div className="h-8 bg-zinc-700 rounded-md"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {borrowedBooks.map((book) => (
                <Card key={book.issue_id} className="bg-zinc-800/40 backdrop-blur-md border-white/10 hover:border-purple-500/30 transition-all duration-300 rounded-xl overflow-hidden shadow-lg hover:shadow-purple-600/10 group">
                  <div className={`h-1 ${new Date(book.due_date) < new Date() ? 'bg-gradient-to-r from-red-600 via-red-500 to-red-600' : 'bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600'}`}></div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium text-gray-200 line-clamp-1 flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${new Date(book.due_date) < new Date() ? 'bg-red-500' : 'bg-purple-500'}`}></div>
                      {book.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <p>Issue Date</p>
                        <p className="font-medium text-gray-300">
                          {new Date(book.issue_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <p className="text-gray-400">Due Date</p>
                        <p className={`font-medium text-right ${new Date(book.due_date) < new Date() ? 'text-red-300' : 'text-gray-300'}`}>
                          {new Date(book.due_date).toLocaleDateString()}
                          {new Date(book.due_date) < new Date() && (
                            <span className="ml-2 inline-flex items-center rounded-full bg-red-900/30 px-2 py-0.5 text-xs font-medium text-red-300 border border-red-500/20">
                              Overdue
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {borrowedBooks.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-400 bg-zinc-800/30 backdrop-blur-md rounded-xl border border-white/10 shadow-inner">
                  <div className="p-6 rounded-full bg-gradient-to-br from-purple-600/10 to-blue-600/10 mb-6 border border-white/10 shadow-inner">
                    <LibraryBig className="h-12 w-12 text-purple-300" />
                  </div>
                  <p className="text-lg font-medium text-gray-200 mb-2">No books currently borrowed</p>
                  <p className="text-sm text-gray-400 text-center max-w-sm px-6">
                    Your reading journey awaits! Visit the Books page to explore our collection and borrow books.
                  </p>
                  <Link to="/books" className="mt-8">
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl px-6 py-2 h-auto text-base shadow-lg shadow-purple-900/20 border border-white/10">
                      Browse Books Collection
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}