import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './Components/Navbar.jsx'
import Products from './Components/Products.jsx'
import ProductDetails from './Components/ProductDetails.jsx'
import Login from './Components/Login.jsx'
import Register from './Components/Register.jsx'
import ProductFormDrawer from './Components/ProductFormDrawer.jsx'
import PrivateRoute from './Components/PrivateRoute.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { Toaster } from 'react-hot-toast'

const AppContent = () => {
  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-950">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/products" element={<PrivateRoute><Products /></PrivateRoute>} />
          <Route path="/products/:id" element={<PrivateRoute><ProductDetails /></PrivateRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
      <Toaster />
      <ProductFormDrawer />
    </div>
  )
}

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  </AuthProvider>
)

export default App