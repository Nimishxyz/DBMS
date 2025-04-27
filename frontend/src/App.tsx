import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout.tsx'
import { Login } from './pages/Login.tsx'
import { SignUp } from './pages/SignUp.tsx'
import { Dashboard } from './pages/Dashboard.tsx'
import { Books } from './pages/Books.tsx'
import { Fines } from './pages/Fines.tsx'
import { ProtectedRoute } from './components/ProtectedRoute.tsx'
import { Profile } from './pages/Profile'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="books" element={<Books />} />
          <Route path="fines" element={<Fines />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        {/* Catch all route - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App