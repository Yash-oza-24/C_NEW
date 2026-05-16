import { createContext, useContext, useEffect, useState } from 'react'
import * as authApi from '../api/auth.js'

const AuthContext = createContext({
  user: null,
  token: null,
  login: async () => {},
  register: async () => {},
  logout: () => {}
})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const savedToken = localStorage.getItem('authToken')
    const savedUser = localStorage.getItem('authUser')
    if (savedToken) {
      setToken(savedToken)
      setUser(savedUser ? JSON.parse(savedUser) : null)
    }
    setInitialized(true)
  }, [])

  const saveAuth = (userData, authToken) => {
    setUser(userData)
    setToken(authToken)
    localStorage.setItem('authToken', authToken)
    localStorage.setItem('authUser', JSON.stringify(userData))
  }

  const login = async (credentials) => {
    const response = await authApi.login(credentials)
    saveAuth(response.user, response.token)
    return response
  }

  const register = async (data) => {
    const response = await authApi.register(data)
    saveAuth(response.user, response.token)
    return response
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('authToken')
    localStorage.removeItem('authUser')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {initialized ? children : null}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
