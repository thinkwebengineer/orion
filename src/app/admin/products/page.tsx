'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  HiOutlineCube,
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineExclamationCircle,
  HiOutlineStar,
  HiOutlineFunnel,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
} from 'react-icons/hi2'

interface Product {
  id: string
  name: string
  category: string
  price: number
  featured: boolean
  images: string[]
  inventory: number | null
}

const categoryTabs = [
  { value: '', label: 'All' },
  { value: 'genetics', label: 'Genetics' },
  { value: 'supplies', label: 'Supplies' },
  { value: 'merch', label: 'Merch' },
]

export default function AdminProductsList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categoryFilter, setCategoryFilter] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        if (categoryFilter) params.set('category', categoryFilter)
        params.set('limit', '200')

        const res = await fetch(`/api/admin/products?${params.toString()}`)
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || 'Failed to load products')
        }
        const data = await res.json()
        setProducts(data.products || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [categoryFilter])

  async function handleDelete(id: string) {
    setDeletingId(id)
    setError(null)

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to delete product')
      }

      setProducts((prev) => prev.filter((p) => p.id !== id))
      setConfirmDelete(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-zinc-400 text-sm mt-1">Manage your product catalog</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FFD700] text-black font-medium text-sm hover:bg-[#FFD700]/90 transition-colors"
        >
          <HiOutlinePlus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <HiOutlineFunnel className="h-4 w-4 text-zinc-500 flex-shrink-0" />
        {categoryTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setCategoryFilter(tab.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              categoryFilter === tab.value
                ? 'bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20'
                : 'text-zinc-400 hover:text-white border border-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Error banner */}
      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Products table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#FFD700] border-t-transparent" />
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-xl border border-dashed border-zinc-800">
          <HiOutlineCube className="h-12 w-12 text-zinc-600 mb-4" />
          <p className="text-zinc-500 text-sm mb-2">No products found</p>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1 text-sm text-[#FFD700] hover:text-[#FFD700]/80"
          >
            <HiOutlinePlus className="h-4 w-4" />
            Add your first product
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-800 bg-[#0f0f0f] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800/50">
                  <th className="text-left px-6 py-4 text-zinc-500 font-medium text-xs uppercase tracking-wider">
                    Product
                  </th>
                  <th className="text-left px-6 py-4 text-zinc-500 font-medium text-xs uppercase tracking-wider">
                    Category
                  </th>
                  <th className="text-left px-6 py-4 text-zinc-500 font-medium text-xs uppercase tracking-wider">
                    Price
                  </th>
                  <th className="text-left px-6 py-4 text-zinc-500 font-medium text-xs uppercase tracking-wider">
                    Inventory
                  </th>
                  <th className="text-left px-6 py-4 text-zinc-500 font-medium text-xs uppercase tracking-wider">
                    Featured
                  </th>
                  <th className="text-right px-6 py-4" />
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-zinc-800/30 hover:bg-zinc-800/20 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-10 w-10 rounded-lg object-cover bg-zinc-800"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                            <HiOutlineCube className="h-5 w-5 text-zinc-500" />
                          </div>
                        )}
                        <span className="text-white font-medium truncate max-w-[200px]">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-zinc-400 capitalize">{product.category}</span>
                    </td>
                    <td className="px-6 py-4 text-white font-medium">
                      ${(product.price || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      {product.inventory !== null && product.inventory !== undefined ? (
                        <span
                          className={`text-xs font-medium ${
                            product.inventory > 0 ? 'text-green-400' : 'text-red-400'
                          }`}
                        >
                          {product.inventory}
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-500">MTO</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {product.featured ? (
                        <HiOutlineStar className="h-4 w-4 text-[#FFD700]" />
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {confirmDelete === product.id ? (
                          <>
                            <button
                              onClick={() => handleDelete(product.id)}
                              disabled={deletingId === product.id}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                            >
                              {deletingId === product.id ? '...' : 'Confirm'}
                            </button>
                            <button
                              onClick={() => setConfirmDelete(null)}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium text-zinc-400 hover:text-white transition-colors"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <Link
                              href={`/admin/products/${product.id}/edit`}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium text-zinc-400 hover:text-[#FFD700] hover:bg-[#FFD700]/10 transition-colors"
                            >
                              <HiOutlinePencil className="h-3.5 w-3.5" />
                              Edit
                            </Link>
                            <button
                              onClick={() => setConfirmDelete(product.id)}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                              <HiOutlineTrash className="h-3.5 w-3.5" />
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
