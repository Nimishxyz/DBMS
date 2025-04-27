import { Navigate, useLocation } from 'react-router-dom'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const userId = localStorage.getItem('userId')
  const location = useLocation()

  if (!userId) {
    // Redirect to /login and save the attempted location
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return <>{children}</>
}