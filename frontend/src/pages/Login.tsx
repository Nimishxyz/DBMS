import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardFooter } from '../components/ui/card'
import axios from '../lib/axios'
import { LogIn, Sparkles } from 'lucide-react'

export function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from: string })?.from || '/'
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await axios.post('/api/auth/login', formData)
      if (response.data.success) {
        localStorage.setItem('userId', response.data.userId)
        localStorage.setItem('cardNo', response.data.cardNo)
        navigate(from) // redirect to the original requested page
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed. Please try again.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black bg-opacity-95 px-4 py-12 relative">
      {/* Ambient background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-600/30 to-blue-600/30 backdrop-blur-lg flex items-center justify-center mb-6 border border-white/10 shadow-lg shadow-purple-500/10">
            <Sparkles className="h-8 w-8 text-purple-300" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-300 via-white to-blue-300 bg-clip-text text-transparent">Welcome Back</h1>
          <p className="text-gray-400">Sign in to your library account</p>
        </div>
        
        <Card className="w-full bg-zinc-900/60 backdrop-blur-md border-purple-500/20 shadow-lg rounded-xl overflow-hidden">
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-purple-600/10 rounded-full blur-2xl"></div>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 pt-6 relative z-10">
              {error && (
                <div className="bg-red-900/30 text-red-300 text-sm p-4 rounded-xl border border-red-500/20 backdrop-blur-md">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-gray-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full bg-zinc-800/50 border-white/10 focus:border-purple-500/50 text-white"
                  placeholder="Enter your username"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-zinc-800/50 border-white/10 focus:border-purple-500/50 text-white"
                  placeholder="Enter your password"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-5 pt-4 relative z-10">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl px-6 py-2 h-auto text-base font-medium shadow-lg shadow-purple-900/20 border border-white/10"
                disabled={isLoading}
              >
                {isLoading ? (
                  'Signing in...'
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </>
                )}
              </Button>
              <p className="text-sm text-center text-gray-400">
                Don't have an account?{' '}
                <Button 
                  variant="link" 
                  className="p-0 h-auto font-semibold text-purple-400 hover:text-purple-300" 
                  onClick={() => navigate('/signup')}
                >
                  Sign Up
                </Button>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}