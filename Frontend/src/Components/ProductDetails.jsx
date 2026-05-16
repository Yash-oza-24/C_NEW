import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProduct } from '../api/products.js'

const ProductDetails = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (id) load()

    function handleSaved(event) {
      const savedProduct = event.detail
      if (!savedProduct) return
      const savedId = savedProduct._id?.toString?.() || savedProduct.id?.toString?.()
      const currentId = id?.toString?.()
      if (savedId && currentId && savedId !== currentId) return
      load()
    }

    window.addEventListener('productSaved', handleSaved)
    return () => window.removeEventListener('productSaved', handleSaved)
  }, [id])

  async function load() {
    setLoading(true)
    try {
      const product = await getProduct(id)
      setProduct(product)
    } catch (err) {
      console.error(err)
      alert('Failed to load')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <p className="p-6">Loading...</p>
  if (!product) return <p className="p-6">No product found</p>

  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-12">
      <div className="grid grid-cols-1 gap-6 rounded bg-white p-6 shadow md:grid-cols-2">
        <div className="space-y-3">
          <div className="flex h-72 w-full items-center justify-center overflow-hidden rounded-md bg-slate-100">
            {product.images && product.images.length ? (
              <img src={product.images[0].startsWith('http') ? product.images[0] : (product.images[0].startsWith('/') ? product.images[0] : `/${product.images[0]}`)} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="text-slate-400">No image</div>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {product.images && product.images.length ? product.images.map((img, i) => (
              <img key={i} src={img} alt={i} className="h-20 w-20 rounded object-cover" />
            )) : <div className="text-slate-400">No images</div>}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold">{product.title}</h2>
          <p className="text-sm text-slate-500">{product.brand} • {product.category}</p>
          <div className="mt-4">
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold">${product.discountPrice && Number(product.discountPrice) < Number(product.price) ? product.discountPrice : product.price}</div>
              {product.discountPrice && Number(product.discountPrice) < Number(product.price) && (
                <div className="text-sm text-slate-400 line-through">${product.price}</div>
              )}
              <div className="ml-auto text-sm text-slate-600">{product.stock} in stock</div>
            </div>
            <p className="mt-4 text-slate-700">{product.description}</p>
          </div>

          <div className="mt-6 flex gap-3">
            <button onClick={() => window.dispatchEvent(new CustomEvent('openProductDrawer', { detail: { mode: 'edit', id } }))} className="rounded bg-sky-600 px-4 py-2 text-white">Edit</button>
            <button onClick={() => navigate('/products')} className="rounded border px-4 py-2">Back</button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductDetails
