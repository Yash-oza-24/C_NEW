import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

const Navbar = () => {
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
        <div className="flex items-center gap-4">
          <Link to="/products" className="text-xl font-bold text-slate-900">CRUD App</Link>
          {user && <span className="hidden text-sm text-slate-500 sm:inline">Welcome, {user.username}</span>}
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <input
              placeholder="Search products..."
              className="hidden sm:inline-flex w-72 rounded-full border border-slate-200 px-4 py-2 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          )}
          {user ? (
            <button onClick={logout} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50">
                Login
              </Link>
              <Link to="/register" className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-500">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
