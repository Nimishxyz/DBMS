import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card'
import { DollarSign, Receipt, AlertCircle, History, Info, Building2, CreditCard, Phone} from 'lucide-react'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import axios from '../lib/axios'

interface Payment {
  payment_id: number
  amount: number
  payment_date: string
}

export function Fines() {
  const [fines, setFines] = useState(0)
  const [paymentAmount, setPaymentAmount] = useState('')
  const [payments, setPayments] = useState<Payment[]>([])
  const [error, setError] = useState('')
  const [isPaymentLoading, setIsPaymentLoading] = useState(false)
  const userId = localStorage.getItem('userId')

  const fetchFines = async () => {
    if (!userId) {
      setError('Please log in to view fines')
      return
    }

    try {
      const response = await axios.get(`/api/books/fines/${userId}`)
      if (response.data.success) {
        setFines(response.data.fines)
        setError('')
      } else {
        setError('Failed to fetch fines')
      }
    } catch (error: any) {
      console.error('Failed to fetch fines:', error)
      setError(error.response?.data?.message || 'Failed to fetch fines. Please try again.')
    }
  }

  const fetchPaymentHistory = async () => {
    if (!userId) return

    try {
      const response = await axios.get(`/api/books/fines/payments/${userId}`)
      if (response.data.success) {
        setPayments(response.data.payments)
      }
    } catch (error: any) {
      console.error('Failed to fetch payment history:', error)
      setError(error.response?.data?.message || 'Failed to fetch payment history')
    }
  }

  const handlePayment = async () => {
    if (!userId) {
      setError('Please log in to pay fines')
      return
    }
  
    setError('')
    setIsPaymentLoading(true)
  
    try {
      const response = await axios.post('/api/books/fines/pay', {
        userId: userId, // Changed from cardNo to userId
        amount: parseFloat(paymentAmount)
      })
  
      if (response.data.success) {
        await fetchFines()
        await fetchPaymentHistory()
        setPaymentAmount('')
      } else {
        setError(response.data.message || 'Payment failed')
      }
    } catch (error: any) {
      console.error('Payment failed:', error)
      setError(error.response?.data?.message || 'Payment failed. Please try again.')
    } finally {
      setIsPaymentLoading(false)
    }
  }

  useEffect(() => {
    fetchFines()
    fetchPaymentHistory()
  }, [userId])

  return (
    <div className="space-y-8 animate-in fade-in duration-500 bg-black bg-opacity-95 min-h-screen p-6">
      {/* Hero section with glass effect */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg border border-purple-500/20 backdrop-blur-md bg-zinc-900/60">
        <div className="absolute -top-40 -right-20 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-20 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="relative p-8 md:p-10 z-10">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-purple-600/30 to-blue-600/30 backdrop-blur-lg flex items-center justify-center mb-6 border border-white/10 shadow-lg shadow-purple-500/10">
            <DollarSign className="h-8 w-8 md:h-10 md:w-10 text-purple-300" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-purple-300 via-white to-blue-300 bg-clip-text text-transparent mb-4">
            Library Fines
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl p-4 rounded-xl border border-white/10 bg-black/20 backdrop-blur-lg shadow-inner">
            Track and manage your library fines. Keep your account in good standing to maintain borrowing privileges.
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
        <Card className={`bg-zinc-900/60 backdrop-blur-md border-${fines > 0 ? 'red' : 'emerald'}-500/20 shadow-lg hover:shadow-${fines > 0 ? 'red' : 'emerald'}-600/10 transition-shadow duration-300 rounded-xl overflow-hidden group`}>
          <div className={`absolute inset-0 bg-gradient-to-br from-${fines > 0 ? 'red' : 'emerald'}-600/5 to-transparent group-hover:from-${fines > 0 ? 'red' : 'emerald'}-600/10 transition-all duration-500`}></div>
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-2 text-white">
              <div className={`p-2 rounded-lg bg-${fines > 0 ? 'red' : 'emerald'}-600/20 backdrop-blur-md border border-${fines > 0 ? 'red' : 'emerald'}-500/30`}>
                <DollarSign className={`h-5 w-5 text-${fines > 0 ? 'red' : 'emerald'}-300`} />
              </div>
              Current Fines
            </CardTitle>
            <CardDescription className="text-gray-400">Your outstanding library fines</CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="mt-2">
              <p className={`text-4xl font-bold ${fines > 0 ? 'text-red-300' : 'text-emerald-300'}`}>
                ${fines.toFixed(2)}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                {fines > 0 ? "Please pay your fines to maintain library privileges" : "No outstanding fines"}
              </p>
              {fines > 0 && (
                <div className="mt-4 space-y-3">
                  <Input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="Enter amount to pay"
                    min="0"
                    max={fines}
                    step="0.01"
                    className="bg-zinc-800/40 border-white/10 focus:border-purple-500/50 backdrop-blur-md"
                  />
                  <Button 
                    onClick={handlePayment}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl px-6 py-2 h-auto text-base shadow-lg shadow-purple-900/20 border border-white/10"
                    disabled={isPaymentLoading || !paymentAmount || parseFloat(paymentAmount) <= 0 || parseFloat(paymentAmount) > fines}
                  >
                    {isPaymentLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        Processing Payment...
                      </div>
                    ) : (
                      <>
                        <DollarSign className="mr-2 h-4 w-4" />
                        Pay Fine
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payment History Card */}
        <Card className="bg-zinc-900/60 backdrop-blur-md border-purple-500/20 shadow-lg hover:shadow-purple-600/10 transition-shadow duration-300 rounded-xl overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-transparent group-hover:from-purple-600/10 transition-all duration-500"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-2 text-white">
              <div className="p-2 rounded-lg bg-purple-600/20 backdrop-blur-md border border-purple-500/30">
                <History className="h-5 w-5 text-purple-300" />
              </div>
              Payment History
            </CardTitle>
            <CardDescription className="text-gray-400">Recent fine payments and transactions</CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="mt-2">
              {payments.length > 0 ? (
                <div className="space-y-4">
                  {payments.map((payment) => (
                    <div key={payment.payment_id} className="flex items-center justify-between p-4 rounded-xl bg-zinc-800/40 backdrop-blur-md border border-white/10 hover:border-purple-500/30 transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-blue-600/20 border border-blue-500/30">
                          <Receipt className="h-4 w-4 text-blue-300" />
                        </div>
                        <div>
                          <p className="font-medium text-white">${payment.amount.toFixed(2)}</p>
                          <p className="text-sm text-gray-400">
                            {new Date(payment.payment_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-blue-600/20 text-xs text-blue-300 border border-blue-500/30">
                        Paid
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="p-4 rounded-full bg-purple-600/10 inline-block mb-4 border border-purple-500/30">
                    <Receipt className="h-8 w-8 text-purple-300" />
                  </div>
                  <p className="text-gray-400">No payment history available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Guide Card */}
      <Card className="bg-zinc-900/60 backdrop-blur-md border-purple-500/20 shadow-lg rounded-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-purple-600/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-600/10 rounded-full blur-2xl"></div>
        <CardHeader className="border-b border-white/5 relative z-10">
          <CardTitle className="flex items-center gap-3 text-lg font-semibold text-white">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-md border border-white/10 shadow-inner">
              <Info className="h-5 w-5 text-purple-300" />
            </div>
            How to Pay Fines
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 relative z-10">
          <div className="grid gap-6 md:grid-cols-3 mt-4">
            <div className="flex flex-col items-center p-6 rounded-xl bg-zinc-800/40 backdrop-blur-md border border-white/10 hover:border-purple-500/30 transition-all duration-300 shadow-lg">
              <div className="p-4 rounded-full bg-gradient-to-br from-purple-600/20 to-blue-600/20 mb-4 border border-white/10 shadow-inner">
                <Building2 className="h-6 w-6 text-purple-300" />
              </div>
              <h3 className="font-medium mb-2 text-white">Visit Library</h3>
              <p className="text-sm text-gray-400 text-center">
                Pay at the library front desk during operating hours
              </p>
            </div>
            <div className="flex flex-col items-center p-6 rounded-xl bg-zinc-800/40 backdrop-blur-md border border-white/10 hover:border-purple-500/30 transition-all duration-300 shadow-lg">
              <div className="p-4 rounded-full bg-gradient-to-br from-purple-600/20 to-blue-600/20 mb-4 border border-white/10 shadow-inner">
                <CreditCard className="h-6 w-6 text-blue-300" />
              </div>
              <h3 className="font-medium mb-2 text-white">Online Payment</h3>
              <p className="text-sm text-gray-400 text-center">
                Pay securely through our online payment portal
              </p>
            </div>
            <div className="flex flex-col items-center p-6 rounded-xl bg-zinc-800/40 backdrop-blur-md border border-white/10 hover:border-purple-500/30 transition-all duration-300 shadow-lg">
              <div className="p-4 rounded-full bg-gradient-to-br from-purple-600/20 to-blue-600/20 mb-4 border border-white/10 shadow-inner">
                <Phone className="h-6 w-6 text-purple-300" />
              </div>
              <h3 className="font-medium mb-2 text-white">Contact Support</h3>
              <p className="text-sm text-gray-400 text-center">
                Need help? Contact library support for assistance
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}