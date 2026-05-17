import React, { useEffect, useRef, useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import { getProduct, createProduct, updateProduct } from '../api/products.js'
import { toast } from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext.jsx'

const initialState = {
  title: '',
  description: '',
  brand: '',
  category: '',
  price: '',
  discountPrice: '',
  stock: '',
  rating: '',
  isFeatured: false
}

const ProductFormDrawer = () => {
  const { user } = useAuth()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerMode, setDrawerMode] = useState('create')
  const [editId, setEditId] = useState(null)
  const [formData, setFormData] = useState(initialState)
  const [files, setFiles] = useState([])
  const fileInputRef = useRef(null)
  const [previews, setPreviews] = useState([])
  const [existingImages, setExistingImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  useEffect(() => {
    function handler(e) {
      const detail = e.detail || {}
      setDrawerMode(detail.mode || 'create')
      setEditId(detail.id || null)
      setDrawerOpen(true)
    }
    window.addEventListener('openProductDrawer', handler)
    return () => window.removeEventListener('openProductDrawer', handler)
  }, [])

  useEffect(() => {
    if (!drawerOpen) return
    if (drawerMode === 'edit' && editId) {
      loadProduct(editId)
    } else {
      resetForm()
    }
  }, [drawerOpen, drawerMode, editId])

  useEffect(() => {
    if (!files || !files.length) return setPreviews([])
    const urls = files.map((file) => URL.createObjectURL(file))
    setPreviews(urls)
    return () => urls.forEach((url) => URL.revokeObjectURL(url))
  }, [files])

  function resetForm() {
    setFormData(initialState)
    setFiles([])
    setPreviews([])
    setExistingImages([])
    setSubmitMessage('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  async function loadProduct(id) {
    setLoading(true)
    try {
      const product = await getProduct(id)
      setFormData({
        title: product.title || '',
        description: product.description || '',
        brand: product.brand || '',
        category: product.category || '',
        price: product.price || '',
        discountPrice: product.discountPrice || '',
        stock: product.stock || '',
        rating: product.rating || '',
        isFeatured: product.isFeatured || false
      })
      setExistingImages(product.images || [])
      setFiles([])
      setPreviews([])
      setSubmitMessage('')
    } catch (error) {
      console.error(error)
      alert('Failed to load product')
      closeDrawer()
    } finally {
      setLoading(false)
    }
  }

  function openCreateDrawer() {
    setDrawerMode('create')
    setEditId(null)
    setDrawerOpen(true)
  }

  function closeDrawer() {
    setDrawerOpen(false)
    setEditId(null)
    setSubmitMessage('')
    resetForm()
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  function handleFiles(event) {
    setFiles(Array.from(event.target.files))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!formData.title || !formData.description) {
      setSubmitMessage('Title and description are required.')
      return
    }

    const hasImages = files.length > 0 || existingImages.length > 0
    if (!hasImages) {
      setSubmitMessage('At least one image is required.')
      return
    }

    const payload = new FormData()
    Object.entries(formData).forEach(([key, value]) => payload.append(key, value))
    files.forEach((file) => payload.append('images', file))

    try {
      setLoading(true)
      let response
      if (drawerMode === 'edit' && editId) {
        response = await updateProduct(editId, payload)
        toast.success('Product updated successfully.')
      } else {
        response = await createProduct(payload)
        toast.success('Product created successfully.')
      }
      window.dispatchEvent(new CustomEvent('productSaved', { detail: response }))
      closeDrawer()
    } catch (error) {
      console.error(error)
      const message = error.response?.data?.error || 'Save failed, try again.'
      setSubmitMessage(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating action button - only show if user is logged in */}
      {user && (
        <button
          onClick={openCreateDrawer}
          className="fixed bottom-6 right-6 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-sky-600 text-white shadow-xl shadow-sky-600/30 transition hover:bg-sky-500 focus:outline focus:outline-offset-2 focus:outline-sky-600"
          aria-label="Add product"
        >
          <FiPlus className="h-7 w-7" aria-hidden="true" />
        </button>
      )}

      {/* Drawer overlay + panel */}
      <div className={`fixed inset-0 z-50 ${drawerOpen ? '' : 'pointer-events-none'}`} aria-hidden={!drawerOpen}>
        <div className={`absolute inset-0 bg-black/40 transition-opacity ${drawerOpen ? 'opacity-100' : 'opacity-0'}`} onClick={closeDrawer} />
        <aside className={`fixed right-0 top-0 h-full w-full sm:w-[560px] transform bg-white shadow-xl transition-transform ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="h-full overflow-auto">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h3 className="text-lg font-semibold">{drawerMode === 'edit' ? 'Edit product' : 'Add product'}</h3>
              <button onClick={closeDrawer} className="rounded border px-3 py-1">Close</button>
            </div>
            <div className="p-6">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <h2 className="text-2xl font-semibold mb-4">{drawerMode === 'edit' ? 'Edit Product' : 'New Product'}</h2>
                <form onSubmit={handleSubmit} className="grid gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-700">Title</label>
                    <input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Product title"
                      className="rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-sky-500"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-700">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Product description"
                      className="min-h-[120px] rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-sky-500"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <label className="text-sm font-medium text-slate-700">Brand</label>
                      <input
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        placeholder="Brand"
                        className="rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-sky-500"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-medium text-slate-700">Category</label>
                      <input
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        placeholder="Category"
                        className="rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-sky-500"
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <label className="text-sm font-medium text-slate-700">Price</label>
                      <input
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="Price"
                        type="number"
                        className="rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-sky-500"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-medium text-slate-700">Discount price</label>
                      <input
                        name="discountPrice"
                        value={formData.discountPrice}
                        onChange={handleChange}
                        placeholder="Discount price"
                        type="number"
                        className="rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-sky-500"
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <label className="text-sm font-medium text-slate-700">Stock</label>
                      <input
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        placeholder="Stock"
                        type="number"
                        className="rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-sky-500"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-medium text-slate-700">Rating</label>
                      <input
                        name="rating"
                        value={formData.rating}
                        onChange={handleChange}
                        placeholder="Rating"
                        type="number"
                        step="0.1"
                        className="rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-sky-500"
                      />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="h-4 w-4 rounded border-slate-300 text-sky-600" />
                    Featured product
                  </label>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-700">Images (multiple allowed)</label>
                    <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleFiles} className="text-sm text-slate-600" />
                  </div>
                  {existingImages.length > 0 && (
                    <div className="grid gap-2 rounded-3xl border border-slate-200 bg-white p-4">
                      <div className="text-sm font-medium text-slate-700">Existing images</div>
                      <div className="flex flex-wrap gap-3">
                        {existingImages.map((src, index) => (
                          <img key={index} src={src.startsWith('http') ? src : src.startsWith('/') ? src : `/${src}`} alt={`existing-${index}`} className="h-20 w-20 rounded object-cover" />
                        ))}
                      </div>
                    </div>
                  )}
                  {previews.length > 0 && (
                    <div className="grid gap-2 rounded-3xl border border-slate-200 bg-white p-4">
                      <div className="text-sm font-medium text-slate-700">Selected images</div>
                      <div className="flex flex-wrap gap-3">
                        {previews.map((src, index) => (
                          <img key={index} src={src} alt={`preview-${index}`} className="h-20 w-20 rounded object-cover" />
                        ))}
                      </div>
                    </div>
                  )}
                  {submitMessage && <p className="text-sm text-red-600">{submitMessage}</p>}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button type="submit" className="rounded-2xl bg-sky-600 px-5 py-3 text-white transition hover:bg-sky-500" disabled={loading}>
                      {loading ? 'Saving...' : 'Save product'}
                    </button>
                    <button type="button" onClick={closeDrawer} className="rounded-2xl border border-slate-300 px-5 py-3 text-slate-700 transition hover:bg-slate-100">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  )
}

export default ProductFormDrawer
