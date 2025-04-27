import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { AlertCircle, User, Home, Phone, Building, Save, Sparkles } from 'lucide-react'
import axios from '../lib/axios'

interface UserProfile {
  user_id: number
  name: string
  address: string
  username: string
  date_signup: string
  phone_no: number | null
  branch_name: string | null
  card_no: number
}

export function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone_no: '',
    branch_name: ''
  })
  const userId = localStorage.getItem('userId')

  const fetchProfile = async () => {
    if (!userId) {
      setError('Not authenticated')
      setIsLoading(false)
      return
    }

    try {
      const response = await axios.get(`/api/users/${userId}/profile`)
      setProfile(response.data)
      setFormData({
        name: response.data.name || '',
        address: response.data.address || '',
        phone_no: response.data.phone_no?.toString() || '',
        branch_name: response.data.branch_name || ''
      })
      setError('')
    } catch (error: any) {
      console.error('Failed to fetch profile:', error)
      setError(error.response?.data?.message || 'Failed to load profile data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return

    setError('')
    try {
      const response = await axios.put(`/api/users/${userId}/profile`, {
        name: formData.name,
        address: formData.address,
        phone_no: formData.phone_no ? parseInt(formData.phone_no) : null,
        branch_name: formData.branch_name || null
      })
      
      if (response.data.success) {
        setIsEditing(false)
        fetchProfile()
      } else {
        setError(response.data.message || 'Failed to update profile')
      }
    } catch (error: any) {
      console.error('Failed to update profile:', error)
      setError(error.response?.data?.message || 'Failed to update profile')
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [userId])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black bg-opacity-95">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-16 w-16 bg-purple-600/20 rounded-full mb-4"></div>
          <div className="h-4 bg-zinc-700 rounded w-48 mb-2"></div>
          <div className="h-3 bg-zinc-700 rounded w-32"></div>
        </div>
      </div>
    )
  }

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
            Your Profile
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl p-4 rounded-xl border border-white/10 bg-black/20 backdrop-blur-lg shadow-inner">
            Manage your personal information and library membership details.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/30 text-red-300 px-4 py-3 rounded-lg flex items-center gap-2 border border-red-500/20 backdrop-blur-md shadow-lg shadow-red-900/10">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-zinc-900/60 backdrop-blur-md border-purple-500/20 shadow-lg hover:shadow-purple-600/10 transition-shadow duration-300 rounded-xl overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-transparent group-hover:from-purple-600/10 transition-all duration-500"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-2 text-white">
              <div className="p-2 rounded-lg bg-purple-600/20 backdrop-blur-md border border-purple-500/30">
                <User className="h-5 w-5 text-purple-300" />
              </div>
              Account Information
            </CardTitle>
            <CardDescription className="text-gray-400">Your library account details</CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            {profile && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-zinc-800/40 border border-white/10 flex flex-col gap-1">
                  <span className="text-xs text-gray-500">Username</span>
                  <span className="text-white font-medium">{profile.username}</span>
                </div>
                
                <div className="p-4 rounded-xl bg-zinc-800/40 border border-white/10 flex flex-col gap-1">
                  <span className="text-xs text-gray-500">Member Since</span>
                  <span className="text-white font-medium">{formatDate(profile.date_signup)}</span>
                </div>
                
                <div className="p-4 rounded-xl bg-zinc-800/40 border border-white/10 flex flex-col gap-1">
                  <span className="text-xs text-gray-500">Library Card Number</span>
                  <span className="text-white font-medium">{profile.card_no}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/60 backdrop-blur-md border-purple-500/20 shadow-lg hover:shadow-purple-600/10 transition-shadow duration-300 rounded-xl overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent group-hover:from-blue-600/10 transition-all duration-500"></div>
          <CardHeader className="relative z-10 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-white">
                <div className="p-2 rounded-lg bg-blue-600/20 backdrop-blur-md border border-blue-500/30">
                  <Home className="h-5 w-5 text-blue-300" />
                </div>
                Personal Information
              </CardTitle>
              <CardDescription className="text-gray-400">Your contact details</CardDescription>
            </div>
            {!isEditing && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsEditing(true)}
                className="border-white/10 text-gray-300 hover:text-white hover:border-purple-500/50"
              >
                Edit
              </Button>
            )}
          </CardHeader>
          <CardContent className="relative z-10">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
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
                    className="bg-zinc-800/40 border-white/10 focus:border-purple-500/50 backdrop-blur-md"
                  />
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
                    className="bg-zinc-800/40 border-white/10 focus:border-purple-500/50 backdrop-blur-md"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-blue-400" />
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone_no}
                    onChange={(e) => setFormData({ ...formData, phone_no: e.target.value })}
                    placeholder="(Optional)"
                    className="bg-zinc-800/40 border-white/10 focus:border-purple-500/50 backdrop-blur-md"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="branch" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <Building className="h-4 w-4 text-blue-400" />
                    Branch
                  </label>
                  <Input
                    id="branch"
                    value={formData.branch_name}
                    onChange={(e) => setFormData({ ...formData, branch_name: e.target.value })}
                    placeholder="(Optional) Enter branch name"
                    className="bg-zinc-800/40 border-white/10 focus:border-purple-500/50 backdrop-blur-md"
                  />
                </div>
                
                <div className="flex gap-3 pt-2">
                  <Button 
                    type="submit" 
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl px-6 py-2 h-auto shadow-lg shadow-purple-900/20 border border-white/10"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false)
                      // Reset form values
                      if (profile) {
                        setFormData({
                          name: profile.name || '',
                          address: profile.address || '',
                          phone_no: profile.phone_no?.toString() || '',
                          branch_name: profile.branch_name || ''
                        })
                      }
                    }}
                    className="border-white/10 text-gray-300 hover:text-white hover:border-purple-500/50"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              profile && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-zinc-800/40 border border-white/10 flex flex-col gap-1">
                    <span className="text-xs text-gray-500">Full Name</span>
                    <span className="text-white font-medium">{profile.name}</span>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-zinc-800/40 border border-white/10 flex flex-col gap-1">
                    <span className="text-xs text-gray-500">Address</span>
                    <span className="text-white font-medium">{profile.address}</span>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-zinc-800/40 border border-white/10 flex flex-col gap-1">
                    <span className="text-xs text-gray-500">Phone Number</span>
                    <span className="text-white font-medium">
                      {profile.phone_no || <span className="text-gray-500 italic">Not provided</span>}
                    </span>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-zinc-800/40 border border-white/10 flex flex-col gap-1">
                    <span className="text-xs text-gray-500">Branch</span>
                    <span className="text-white font-medium">
                      {profile.branch_name || <span className="text-gray-500 italic">Not specified</span>}
                    </span>
                  </div>
                </div>
              )
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}