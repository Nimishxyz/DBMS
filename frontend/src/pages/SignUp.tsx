import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardFooter } from '../components/ui/card'
import { UserPlus, User, Home, Phone, Building, Lock, AlertCircle } from 'lucide-react'
import axios from '../lib/axios'

export function SignUp() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    username: '',
    password: '',
    phone: '',
    branchName: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await axios.post('/api/auth/signup', {
        ...formData,
        phone: formData.phone ? parseInt(formData.phone) : null,
        branchName: formData.branchName || null
      })
      
      if (response.data.success) {
        navigate('/login')
      } else {
        setError(response.data.message || 'Failed to create account')
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create account. Please try again.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black bg-opacity-95 px-4 py-12 animate-in fade-in duration-500">
      <div className="w-full max-w-lg space-y-8">
        {/* Hero section with glass effect */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg border border-purple-500/20 backdrop-blur-md bg-zinc-900/60">
          <div className="absolute -top-40 -right-20 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-20 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl"></div>
          <div className="relative p-8 z-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600/30 to-blue-600/30 backdrop-blur-lg flex items-center justify-center mb-6 border border-white/10 shadow-lg shadow-purple-500/10">
              <UserPlus className="h-8 w-8 text-purple-300" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-300 via-white to-blue-300 bg-clip-text text-transparent mb-4">
              Create an Account
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl p-4 rounded-xl border border-white/10 bg-black/20 backdrop-blur-lg shadow-inner">
              Sign up for your library membership to access our extensive collection of books and resources.
            </p>
          </div>
        </div>

        <Card className="bg-zinc-900/60 backdrop-blur-md border-purple-500/20 shadow-lg hover:shadow-purple-600/10 transition-shadow duration-300 rounded-xl overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-purple-600/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-600/10 rounded-full blur-2xl"></div>
          <form onSubmit={handleSubmit}>
            <CardContent className="grid gap-6 pt-6 relative z-10">
              {error && (
                <div className="bg-red-900/30 text-red-300 text-sm p-4 rounded-xl flex items-center gap-2 border border-red-500/20 backdrop-blur-md shadow-lg shadow-red-900/10">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  {error}
                </div>
              )}
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <User className="h-4 w-4 text-purple-400" />
                    Full Name
                  </label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="bg-zinc-800/40 border-white/10 focus:border-purple-500/50 backdrop-blur-md text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-400" />
                    Username
                  </label>
                  <Input
                    id="username"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="johndoe"
                    className="bg-zinc-800/40 border-white/10 focus:border-purple-500/50 backdrop-blur-md text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Home className="h-4 w-4 text-purple-400" />
                  Address
                </label>
                <Input
                  id="address"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter your full address"
                  className="bg-zinc-800/40 border-white/10 focus:border-purple-500/50 backdrop-blur-md text-white"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-blue-400" />
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(Optional)"
                    className="bg-zinc-800/40 border-white/10 focus:border-purple-500/50 backdrop-blur-md text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="branchName" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <Building className="h-4 w-4 text-purple-400" />
                    Branch
                  </label>
                  <Input
                    id="branchName"
                    value={formData.branchName}
                    onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
                    placeholder="(Optional) Enter branch name"
                    className="bg-zinc-800/40 border-white/10 focus:border-purple-500/50 backdrop-blur-md text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-blue-400" />
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Create a secure password"
                  className="bg-zinc-800/40 border-white/10 focus:border-purple-500/50 backdrop-blur-md text-white"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pt-4 pb-6 relative z-10">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl px-6 py-2 h-auto text-base font-medium shadow-lg shadow-purple-900/20 border border-white/10"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    Creating Account...
                  </div>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create Account
                  </>
                )}
              </Button>
              <p className="text-sm text-center text-gray-400">
                Already have an account?{' '}
                <Button variant="link" className="p-0 h-auto font-semibold text-purple-400 hover:text-purple-300" onClick={() => navigate('/login')}>
                  Sign In
                </Button>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}