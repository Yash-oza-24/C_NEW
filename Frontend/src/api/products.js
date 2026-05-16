import client from './axiosClient.js'

export const getProducts = () => client.get('/products').then((res) => res.data)
export const getProduct = (id) => client.get(`/products/${id}`).then((res) => res.data)
export const createProduct = (formData) => client.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((res) => res.data)
export const updateProduct = (id, formData) => client.put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((res) => res.data)
export const deleteProduct = (id) => client.delete(`/products/${id}`).then((res) => res.data)
