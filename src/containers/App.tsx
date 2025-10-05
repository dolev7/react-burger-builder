import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../contexts/AuthContext'
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute'
import './App.css'
import Layout from '../components/Layout/Layout'
import BurgerBuilder from '../components/BurgerBuilder/BurgerBuilder'
import Auth from '../components/Auth/Auth'
import Orders from '../components/Orders/Orders'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Layout>
            <Routes>
              <Route path="/" element={
                <ProtectedRoute>
                  <BurgerBuilder />
                </ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              } />
              <Route path="/auth" element={<Auth />} />
              <Route path="*" element={
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <h2>Page Not Found</h2>
                  <p>The page you're looking for doesn't exist.</p>
                </div>
              } />
            </Routes>
          </Layout>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
