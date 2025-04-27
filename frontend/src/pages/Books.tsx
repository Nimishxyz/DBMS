import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/card'
import axios from '../lib/axios'
import { PlusCircle, BookPlus, BookOpen, Book, Search, BookX, BookCheck, Library, Bookmark, Filter } from 'lucide-react'

interface Book {
  id: number
  isbn: string
  title: string
  author: string
  available_copies: number
  branch_name: string
}

interface NewBook {
  isbn: string
  title: string
  author: string
  available_copies: number
  branch_name: string,
  lost_cost: number
}

export function Books() {
  const [books, setBooks] = useState<Book[]>([])
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [error, setError] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [newBook, setNewBook] = useState<NewBook>({
    isbn: '',
    title: '',
    author: '',
    available_copies: 1,
    branch_name: '',
    lost_cost: 0,
  })
  const userId = localStorage.getItem('userId')

  const requestBook = async (bookId: number) => {
    try {
      const response = await axios.post('/api/books/request', {
        userId,
        bookId
      })
      if (response.data.success) {
        fetchBooks()
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to request book')
    }
  }

  const addBook = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const response = await axios.post('/api/books/add', newBook)
      if (response.data.success) {
        setShowAddForm(false)
        setNewBook({
          isbn: '',
          title: '',
          author: '',
          available_copies: 1,
          branch_name: '',
          lost_cost: 0,
        })
        fetchBooks()
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to add book')
    }
  }

  const fetchBooks = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get('/api/books')
      setBooks(response.data)
      setFilteredBooks(response.data)
      setError('')
    } catch (error) {
      console.error('Failed to fetch books:', error)
      setError('Failed to fetch books')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const filtered = books.filter(
        book =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.isbn.toLowerCase().includes(query) ||
          book.branch_name.toLowerCase().includes(query)
      )
      setFilteredBooks(filtered)
    } else {
      if (activeFilter === 'all') {
        setFilteredBooks(books)
      } else if (activeFilter === 'available') {
        setFilteredBooks(books.filter(book => book.available_copies > 0))
      } else if (activeFilter === 'unavailable') {
        setFilteredBooks(books.filter(book => book.available_copies === 0))
      }
    }
  }, [searchQuery, books, activeFilter])

  return (
    <div className="space-y-8 animate-in fade-in duration-500 bg-black bg-opacity-95 min-h-screen p-6">
      {/* Hero section with glass effect */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg border border-purple-500/20 backdrop-blur-md bg-zinc-900/60">
        <div className="absolute -top-40 -right-20 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-20 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="relative p-8 md:p-10 z-10">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-purple-600/30 to-blue-600/30 backdrop-blur-lg flex items-center justify-center mb-6 border border-white/10 shadow-lg shadow-purple-500/10">
            <Library className="h-8 w-8 md:h-10 md:w-10 text-purple-300" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-purple-300 via-white to-blue-300 bg-clip-text text-transparent mb-4">
            Library Collection
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl p-4 rounded-xl border border-white/10 bg-black/20 backdrop-blur-lg shadow-inner">
            Explore our extensive collection of books across various genres and authors.
            Request any book to start your reading journey today.
          </p>
        </div>
      </div>

      {/* Search and filter section with glass effect */}
      <Card className="bg-zinc-900/60 backdrop-blur-md border-purple-500/20 shadow-lg rounded-xl overflow-hidden animate-in slide-in-from-top-4 duration-300">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by title, author, ISBN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-zinc-800/70 border-white/10 focus:border-purple-500/50 text-white focus:ring-purple-500/20"
              />
            </div>
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-0">
              <Button
                variant={activeFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setActiveFilter('all')}
                className={`transition-all duration-200 group hover:shadow-md ${activeFilter === 'all' ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white' : 'border-white/10 text-gray-300 hover:text-white hover:border-purple-500/50'}`}
                size="sm"
              >
                <Filter className="h-4 w-4 mr-1 group-hover:text-purple-300 transition-colors" />
                All Books
              </Button>
              <Button
                variant={activeFilter === 'available' ? 'default' : 'outline'}
                onClick={() => setActiveFilter('available')}
                className={`transition-all duration-200 group hover:shadow-md ${activeFilter === 'available' ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white' : 'border-white/10 text-gray-300 hover:text-white hover:border-purple-500/50'}`}
                size="sm"
              >
                <BookCheck className="h-4 w-4 mr-1 group-hover:text-purple-300 transition-colors" />
                Available
              </Button>
              <Button
                variant={activeFilter === 'unavailable' ? 'default' : 'outline'}
                onClick={() => setActiveFilter('unavailable')}
                className={`transition-all duration-200 group hover:shadow-md ${activeFilter === 'unavailable' ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white' : 'border-white/10 text-gray-300 hover:text-white hover:border-purple-500/50'}`}
                size="sm"
              >
                <BookX className="h-4 w-4 mr-1 group-hover:text-purple-300 transition-colors" />
                Unavailable
              </Button>
              <div className="ml-auto">
                <Button 
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl px-6 py-2 h-auto shadow-lg shadow-purple-900/20 border border-white/10"
                >
                  {showAddForm ? (
                    'Cancel'
                  ) : (
                    <>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Book
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="bg-red-900/30 border border-red-500/20 text-red-300 flex items-center gap-2 p-4 rounded-lg animate-in fade-in-50 backdrop-blur-md">
          <div className="p-1.5 rounded-full bg-red-500/20">
            <BookX className="h-4 w-4" />
          </div>
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {showAddForm && (
        <Card className="bg-zinc-900/60 backdrop-blur-md border-purple-500/20 shadow-lg rounded-xl overflow-hidden animate-in slide-in-from-top-4 duration-300">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600/60 via-blue-600 to-purple-600/60"></div>
          <CardHeader>
            <CardTitle className="flex items-center text-xl text-white">
              <BookPlus className="mr-2 h-5 w-5 text-purple-400" />
              Add New Book
            </CardTitle>
            <CardDescription className="text-gray-400">
              Fill in the details below to add a new book to the library collection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-6" onSubmit={addBook}>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium text-gray-300">Title</label>
                  <Input
                    id="title"
                    value={newBook.title}
                    onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                    placeholder="Book title"
                    required
                    className="bg-zinc-800/70 border-white/10 focus:border-purple-500/50 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="author" className="text-sm font-medium text-gray-300">Author</label>
                  <Input
                    id="author"
                    value={newBook.author}
                    onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                    placeholder="Author name"
                    required
                    className="bg-zinc-800/70 border-white/10 focus:border-purple-500/50 text-white"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="isbn" className="text-sm font-medium text-gray-300">ISBN</label>
                  <Input
                    id="isbn"
                    value={newBook.isbn}
                    onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                    placeholder="ISBN number"
                    required
                    className="bg-zinc-800/70 border-white/10 focus:border-purple-500/50 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="branch" className="text-sm font-medium text-gray-300">Branch</label>
                  <Input
                    id="branch"
                    value={newBook.branch_name}
                    onChange={(e) => setNewBook({ ...newBook, branch_name: e.target.value })}
                    placeholder="Library branch"
                    required
                    className="bg-zinc-800/70 border-white/10 focus:border-purple-500/50 text-white"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="copies" className="text-sm font-medium text-gray-300">Available Copies</label>
                  <Input
                    id="copies"
                    type="number"
                    min="0"
                    value={newBook.available_copies}
                    onChange={(e) => setNewBook({ ...newBook, available_copies: parseInt(e.target.value) })}
                    required
                    className="bg-zinc-800/70 border-white/10 focus:border-purple-500/50 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lost_cost" className="text-sm font-medium text-gray-300">Lost Cost ($)</label>
                  <Input
                    id="lost_cost"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newBook.lost_cost}
                    onChange={(e) => setNewBook({ ...newBook, lost_cost: parseFloat(e.target.value) })}
                    required
                    className="bg-zinc-800/70 border-white/10 focus:border-purple-500/50 text-white"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl px-6 py-2 h-auto shadow-lg shadow-purple-900/20 border border-white/10"
              >
                <BookPlus className="mr-2 h-4 w-4" />
                Add Book to Collection
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-pulse flex space-x-4 items-center">
            <div className="rounded-full bg-purple-600/20 h-12 w-12 flex items-center justify-center border border-white/10">
              <BookOpen className="h-6 w-6 text-purple-400/40" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-purple-600/20 rounded w-[250px]"></div>
              <div className="h-3 bg-purple-600/10 rounded w-[200px]"></div>
            </div>
          </div>
          <p className="text-gray-400 mt-4">Loading books collection...</p>
        </div>
      ) : (
        <>
          {/* Books count summary */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 bg-zinc-800/40 backdrop-blur-md rounded-lg px-4 py-2 border border-white/10">
              <Book className="h-5 w-5 text-purple-400" />
              <span className="font-medium text-white">
                {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'} found
              </span>
            </div>
            
            {searchQuery && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSearchQuery('')} 
                className="text-xs text-gray-400 hover:text-white hover:bg-zinc-800/40"
              >
                Clear search
              </Button>
            )}
          </div>

          {/* Card-based book display for smaller screens */}
          <div className="grid grid-cols-1 md:hidden gap-4">
            {filteredBooks.map((book) => (
              <Card key={book.id} className="bg-zinc-800/40 backdrop-blur-md border-white/10 hover:border-purple-500/30 transition-all duration-300 rounded-xl overflow-hidden shadow-lg hover:shadow-purple-600/10 group">
                <CardContent className="p-0">
                  <div className="relative">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-600 to-blue-600"></div>
                    <div className="p-4 pl-5">
                      <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors line-clamp-1">{book.title}</h3>
                      <p className="text-gray-400 text-sm">{book.author}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                        <div>
                          <p className="text-xs text-gray-500">ISBN</p>
                          <p className="font-mono font-medium text-gray-300">{book.isbn}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Branch</p>
                          <p className="font-medium text-gray-300">{book.branch_name}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${book.available_copies > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className={`text-sm ${book.available_copies > 0 ? `${book.available_copies} available` : 'Unavailable'}`}>
                            {book.available_copies > 0 ? `${book.available_copies} available` : 'Unavailable'}
                          </span>
                        </div>
                        <Button
                          variant={book.available_copies === 0 ? "ghost" : "default"}
                          disabled={book.available_copies === 0}
                          onClick={() => requestBook(book.id)}
                          size="sm"
                          className={book.available_copies > 0 ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border border-white/10' : 'text-gray-500 border-white/10'}
                        >
                          {book.available_copies === 0 ? 'Unavailable' : 'Request'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Table view for larger screens */}
          <div className="hidden md:block">
            <Card className="bg-zinc-900/60 backdrop-blur-md border-purple-500/20 shadow-lg rounded-xl overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-purple-600/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-600/10 rounded-full blur-2xl"></div>
              <CardContent className="p-0 relative z-10">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-black/30 border-b border-white/10 hover:bg-black/40">
                      <TableHead className="font-semibold text-gray-300">Title</TableHead>
                      <TableHead className="font-semibold text-gray-300">Author</TableHead>
                      <TableHead className="font-semibold text-gray-300">ISBN</TableHead>
                      <TableHead className="font-semibold text-gray-300">Branch</TableHead>
                      <TableHead className="font-semibold text-gray-300">Available</TableHead>
                      <TableHead className="text-right font-semibold text-gray-300">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBooks.map((book, index) => (
                      <TableRow 
                        key={book.id}
                        className={`group hover:bg-zinc-800/50 transition-colors border-white/5 ${index % 2 === 0 ? 'bg-black/20' : 'bg-black/10'}`}
                      >
                        <TableCell className="font-medium text-white group-hover:text-purple-300 transition-colors">{book.title}</TableCell>
                        <TableCell className="text-gray-300">{book.author}</TableCell>
                        <TableCell className="font-mono text-xs text-gray-400">{book.isbn}</TableCell>
                        <TableCell className="text-gray-300">{book.branch_name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${book.available_copies > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className={book.available_copies > 0 ? 'text-green-400' : 'text-red-400'}>
                              {book.available_copies}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant={book.available_copies === 0 ? "ghost" : "default"}
                            disabled={book.available_copies === 0}
                            onClick={() => requestBook(book.id)}
                            size="sm"
                            className={book.available_copies > 0 ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border border-white/10 shadow-lg shadow-purple-900/10' : 'text-gray-500 border-white/10'}
                          >
                            {book.available_copies === 0 ? (
                              <>
                                <BookX className="mr-1 h-3 w-3" /> 
                                Unavailable
                              </>
                            ) : (
                              <>
                                <Bookmark className="mr-1 h-3 w-3" /> 
                                Request
                              </>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredBooks.length === 0 && (
                      <TableRow className="border-white/5">
                        <TableCell colSpan={6} className="h-32">
                          <div className="flex flex-col items-center justify-center text-center p-4">
                            <div className="rounded-full bg-purple-600/10 p-3 mb-2 border border-white/10">
                              <Library className="h-6 w-6 text-purple-400" />
                            </div>
                            <p className="text-gray-300 font-medium">No books found</p>
                            <p className="text-gray-500 text-sm mt-1">
                              {searchQuery ? 'Try adjusting your search' : 'Try adding some books to the collection'}
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}