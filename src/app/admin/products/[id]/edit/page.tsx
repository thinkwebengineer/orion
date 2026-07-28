'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { HiOutlineArrowLeft, HiOutlinePlus, HiOutlineTrash, HiOutlineExclamationCircle } from 'react-icons/hi2'
import ImageUploader from '@/components/admin/ImageUploader'

interface VariantEntry {
  label: string
  price: string
  bestValue: boolean
}

const categories = [
  { value: 'genetics', label: 'Genetics' },
  { value: 'supplies', label: 'Supplies' },
  { value: 'merch', label: 'Merch' },
]

const brands = [{ value: 'golden-mycology', label: 'Golden Mycology' }]

export default function AdminProductEdit({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [productId, setProductId] = useState('')
  const [loading, setLoading] = useState(true)

  const [name, setName] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [brand, setBrand] = useState('golden-mycology')
  const [category, setCategory] = useState('')
  const [subcategory, setSubcategory] = useState('')
  const [price, setPrice] = useState('')
  const [variants, setVariants] = useState<VariantEntry[]>([])
  const [description, setDescription] = useState('')
  const [features, setFeatures] = useState<string[]>([''])
  const [images, setImages] = useState<string[]>([])
  const [inventory, setInventory] = useState('')
  const [featured, setFeatured] = useState(false)
  const [forMicroscopyOnly, setForMicroscopyOnly] = useState(false)
  const [tagsInput, setTagsInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Resolve params
  useEffect(() => {
    params.then((p) => setProductId(p.id))
  }, [params])

  // Fetch existing product
  useEffect(() => {
    if (!productId) return

    async function fetchProduct() {
      setLoading(true)
      try {
        const res = await fetch('/api/admin/products?limit=500')
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || 'Failed to load product')
        }
        const { products } = await res.json()
        const product = products?.find((p: Record<string, unknown>) => p.id === productId)
        if (!product) throw new Error('Product not found')

        setName(product.name as string)
        setSubtitle((product.subtitle as string) || '')
        setBrand((product.brand as string) || 'golden-mycology')
        setCategory(product.category as string)
        setSubcategory(product.subcategory as string)
        setPrice(String(product.price))
        setVariants(
          ((product.variants as VariantEntry[]) || []).map((v) => ({
            label: v.label,
            price: String(v.price),
            bestValue: v.bestValue || false,
          })),
        )
        setDescription(product.description as string)
        setFeatures(
          (product.features as string[])?.length > 0
            ? (product.features as string[])
            : [''],
        )
        setImages(
          (product.images as string[])?.length > 0
            ? (product.images as string[])
            : [],
        )
        setInventory(
          product.inventory !== null && product.inventory !== undefined
            ? String(product.inventory)
            : '',
        )
        setFeatured(!!product.featured)
        setForMicroscopyOnly(
          !!(product.for_microscopy_only ?? product.forMicroscopyOnly),
        )
        setTagsInput((product.tags as string[])?.join(', ') || '')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  function addVariant() {
    setVariants((prev) => [...prev, { label: '', price: '', bestValue: false }])
  }

  function updateVariant(index: number, field: keyof VariantEntry, value: string | boolean) {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v)),
    )
  }

  function removeVariant(index: number) {
    setVariants((prev) => prev.filter((_, i) => i !== index))
  }

  function addFeature() {
    setFeatures((prev) => [...prev, ''])
  }

  function updateFeature(index: number, value: string) {
    setFeatures((prev) => prev.map((f, i) => (i === index ? value : f)))
  }

  function removeFeature(index: number) {
    setFeatures((prev) => prev.filter((_, i) => i !== index))
  }

  function addImage() {
    setImages((prev) => [...prev, ''])
  }

  function updateImage(index: number, value: string) {
    setImages((prev) => prev.map((img, i) => (i === index ? value : img)))
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    if (!name || !category || !subcategory || !price || !description) {
      setError('Please fill in all required fields (Name, Category, Subcategory, Price, Description)')
      setSaving(false)
      return
    }

    const cleanFeatures = features.filter((f) => f.trim())
    const cleanImages = images.filter((img) => img.trim())
    const cleanVariants = variants
      .filter((v) => v.label && v.price)
      .map((v) => ({ ...v, price: Number(v.price) }))
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    const productData = {
      name,
      subtitle: subtitle || undefined,
      brand,
      category,
      subcategory,
      price: Number(price),
      variants: cleanVariants.length > 0 ? cleanVariants : undefined,
      description,
      features: cleanFeatures,
      images: cleanImages,
      inventory: inventory || '',
      featured,
      forMicroscopyOnly,
      tags,
    }

    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to update product')
      }

      router.push('/admin/products')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    setError(null)

    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to delete product')
      }

      router.push('/admin/products')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#FFD700] border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back link */}
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white transition-colors"
      >
        <HiOutlineArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Product</h1>
          <p className="text-zinc-400 text-sm mt-1 font-mono">{productId}</p>
        </div>
        {/* Delete button */}
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-500/30 text-red-400 text-xs font-medium hover:bg-red-500/10 transition-colors"
          >
            <HiOutlineTrash className="h-4 w-4" />
            Delete
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs text-red-400">Are you sure?</span>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {deleting ? '...' : 'Confirm'}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-300 text-xs font-medium hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Error banner */}
      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 flex items-start gap-3">
          <HiOutlineExclamationCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <section className="rounded-xl border border-zinc-800 bg-[#0f0f0f] p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white">Basic Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs text-zinc-500 mb-1.5">
                Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Product name"
                className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs text-zinc-500 mb-1.5">Subtitle</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Short tagline or subtitle"
                className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700]"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-500 mb-1.5">Brand</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700]"
              >
                {brands.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-zinc-500 mb-1.5">
                Category <span className="text-red-400">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700]"
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-zinc-500 mb-1.5">
                Subcategory <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                placeholder="e.g., liquid-cultures"
                className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700]"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-500 mb-1.5">
                Price ($) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700]"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-500 mb-1.5">
                Inventory <span className="text-zinc-600">(leave empty for MTO)</span>
              </label>
              <input
                type="number"
                min="0"
                value={inventory}
                onChange={(e) => setInventory(e.target.value)}
                placeholder="MTO"
                className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700]"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-[#FFD700] focus:ring-[#FFD700] focus:ring-offset-0"
              />
              <span className="text-sm text-zinc-300">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={forMicroscopyOnly}
                onChange={(e) => setForMicroscopyOnly(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-[#FFD700] focus:ring-[#FFD700] focus:ring-offset-0"
              />
              <span className="text-sm text-zinc-300">For Microscopy Only</span>
            </label>
          </div>
        </section>

        {/* Variants */}
        <section className="rounded-xl border border-zinc-800 bg-[#0f0f0f] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Variants</h2>
            <button
              type="button"
              onClick={addVariant}
              className="inline-flex items-center gap-1 text-xs text-[#FFD700] hover:text-[#FFD700]/80 transition-colors"
            >
              <HiOutlinePlus className="h-3.5 w-3.5" />
              Add Variant
            </button>
          </div>
          {variants.length === 0 ? (
            <p className="text-xs text-zinc-500">No variants. The product will use the base price.</p>
          ) : (
            <div className="space-y-3">
              {variants.map((variant, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={variant.label}
                    onChange={(e) => updateVariant(index, 'label', e.target.value)}
                    placeholder="Label (e.g., 10mL)"
                    className="flex-1 px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700]"
                  />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={variant.price}
                    onChange={(e) => updateVariant(index, 'price', e.target.value)}
                    placeholder="Price"
                    className="w-24 px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700]"
                  />
                  <label className="flex items-center gap-1.5 text-xs text-zinc-400 cursor-pointer whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={variant.bestValue}
                      onChange={(e) => updateVariant(index, 'bestValue', e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-zinc-600 bg-zinc-800 text-[#FFD700] focus:ring-[#FFD700] focus:ring-offset-0"
                    />
                    Best Value
                  </label>
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    <HiOutlineTrash className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Description */}
        <section className="rounded-xl border border-zinc-800 bg-[#0f0f0f] p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white">
            Description <span className="text-red-400">*</span>
          </h2>
          <textarea
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Product description..."
            className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700] resize-none"
          />
        </section>

        {/* Features */}
        <section className="rounded-xl border border-zinc-800 bg-[#0f0f0f] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Features</h2>
            <button
              type="button"
              onClick={addFeature}
              className="inline-flex items-center gap-1 text-xs text-[#FFD700] hover:text-[#FFD700]/80 transition-colors"
            >
              <HiOutlinePlus className="h-3.5 w-3.5" />
              Add Feature
            </button>
          </div>
          <div className="space-y-2">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => updateFeature(index, e.target.value)}
                  placeholder="Feature description"
                  className="flex-1 px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700]"
                />
                {features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    <HiOutlineTrash className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Images */}
        <section className="rounded-xl border border-zinc-800 bg-[#0f0f0f] p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white">Images</h2>
          <p className="text-xs text-zinc-500">Upload product photos (max 10, 5MB each)</p>
          <ImageUploader images={images} onImagesChange={setImages} maxImages={10} maxSizeMB={5} />
        </section>

        {/* Tags */}
        <section className="rounded-xl border border-zinc-800 bg-[#0f0f0f] p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white">Tags</h2>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="Comma-separated tags (e.g., premium, limited, best-seller)"
            className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700]"
          />
        </section>

        {/* Submit */}
        <div className="flex items-center gap-4 pb-8">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-lg bg-[#FFD700] text-black font-medium text-sm hover:bg-[#FFD700]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
          <Link
            href="/admin/products"
            className="px-4 py-2.5 rounded-lg border border-zinc-700 text-zinc-300 text-sm hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
