import client from './axiosClient.js'

export const login = async ({ email, password }) => {
  const response = await client.post('/users/login', { email, password })
  return response.data
}

export const register = async ({ username, email, password }) => {
  await client.post('/users/register', { username, email, password })
  return login({ email, password })
}
