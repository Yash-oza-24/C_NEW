import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { getProducts, deleteProduct } from '../api/products.js'

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchProducts()
    function onSaved() { fetchProducts() }
    window.addEventListener('productSaved', onSaved)
    return () => window.removeEventListener('productSaved', onSaved)
  }, [])

  async function fetchProducts() {
    setLoading(true)
    try {
      const productList = await getProducts()
      setProducts(productList)
    } catch (err) {
      console.error(err)
      alert('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this product?')) return
    try {
      await deleteProduct(id)
      setProducts((p) => p.filter((x) => x._id !== id))
      toast.success('Product deleted successfully.')
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete product.')
    }
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Products</h2>
        </div>
        <div>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div key={product._id} className="relative overflow-hidden rounded-2xl border bg-white p-0 shadow hover:shadow-lg transition">
              {product.isFeatured && (
                <div className="absolute right-0 top-0 z-10 m-3 rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold">Featured</div>
              )}
              <div className="h-52 w-full overflow-hidden bg-slate-100">
                {product.images && product.images[0] ? (
                  <img src={product.images[0].startsWith('http') ? product.images[0] : (product.images[0].startsWith('/') ? product.images[0] : `/${product.images[0]}`)} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-400">No image</div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium truncate">{product.title}</h3>
                <p className="text-sm text-slate-500">{product.brand} • {product.category}</p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-baseline gap-3">
                    <div className="text-lg font-semibold text-slate-900">${product.discountPrice && Number(product.discountPrice) < Number(product.price) ? product.discountPrice : product.price}</div>
                    {product.discountPrice && Number(product.discountPrice) < Number(product.price) && (
                      <div className="text-sm text-slate-400 line-through">${product.price}</div>
                    )}
                  </div>
                  <div className="text-sm text-slate-600">{product.stock} in stock</div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => navigate(`/products/${product._id}`)} className="rounded border px-3 py-1 text-sm">View</button>
                  <button onClick={() => window.dispatchEvent(new CustomEvent('openProductDrawer', { detail: { mode: 'edit', id: product._id } }))} className="rounded border px-3 py-1 text-sm">Edit</button>
                  <button onClick={() => handleDelete(product._id)} className="ml-auto rounded bg-red-600 px-3 py-1 text-sm text-white">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default Products
