'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  HiOutlineArrowLeft,
  HiOutlineShoppingBag,
  HiOutlineTruck,
  HiOutlineExclamationCircle,
  HiOutlineCheckCircle,
  HiOutlineDocumentText,
  HiOutlineTag,
  HiOutlineMapPin,
  HiOutlineEnvelope,
  HiOutlineCreditCard,
  HiOutlineCube,
} from 'react-icons/hi2'

interface LineItem {
  product_id?: string
  name?: string
  price?: number
  quantity?: number
  image?: string
  variant_label?: string
}

interface Order {
  id: string
  customer_email: string
  shipping_address: string | Record<string, unknown>
  line_items: LineItem[]
  total: number
  subtotal?: number
  tax?: number
  shipping_cost?: number
  payment_status: string
  fulfillment_status: string
  tracking_number?: string
  notes?: string
  created_at: string
  updated_at?: string
}

const statusOptions = [
  { value: 'pending', label: 'Pending', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: HiOutlineShoppingBag },
  { value: 'processing', label: 'Processing', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: HiOutlineTruck },
  { value: 'shipped', label: 'Shipped', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: HiOutlineTruck },
  { value: 'delivered', label: 'Delivered', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: HiOutlineCheckCircle },
  { value: 'cancelled', label: 'Cancelled', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: HiOutlineExclamationCircle },
]

const paymentColors: Record<string, string> = {
  pending: 'text-yellow-400',
  confirmed: 'text-green-400',
  failed: 'text-red-400',
}

function formatAddress(addr: string | Record<string, unknown> | undefined): string {
  if (!addr) return 'N/A'
  if (typeof addr === 'string') return addr
  try {
    return Object.values(addr).filter(Boolean).join(', ')
  } catch {
    return 'N/A'
  }
}

export default function AdminOrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [resending, setResending] = useState(false)
  const [orderId, setOrderId] = useState<string>('')

  // Editable fields
  const [fulfillmentStatus, setFulfillmentStatus] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [notes, setNotes] = useState('')

  // Resolve params
  useEffect(() => {
    params.then((p) => setOrderId(p.id))
  }, [params])

  // Fetch order
  useEffect(() => {
    if (!orderId) return

    async function fetchOrder() {
      setLoading(true)
      setError(null)
      try {
        // Fetch all orders and find this one
        const res = await fetch('/api/admin/orders?limit=500')
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || 'Failed to load order')
        }
        const { orders } = await res.json()
        const found = orders?.find((o: Order) => o.id === orderId)
        if (!found) throw new Error('Order not found')

        setOrder(found)
        setFulfillmentStatus(found.fulfillment_status || 'pending')
        setTrackingNumber(found.tracking_number || '')
        setNotes(found.notes || '')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  async function handleSave() {
    if (!order) return
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: order.id,
          fulfillment_status: fulfillmentStatus,
          tracking_number: trackingNumber,
          notes,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to update order')
      }

      setSuccess('Order updated successfully')
      setOrder((prev) =>
        prev
          ? {
              ...prev,
              fulfillment_status: fulfillmentStatus,
              tracking_number: trackingNumber,
              notes,
            }
          : prev,
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  async function handleResendConfirmation() {
    if (!order) return
    setResending(true)
    setError(null)
    setSuccess(null)

    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: order.id, resend_confirmation: true }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to resend confirmation')
      }

      setSuccess('Confirmation email resent')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setResending(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#FFD700] border-t-transparent" />
      </div>
    )
  }

  if (error && !order) {
    return (
      <div className="max-w-4xl mx-auto">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white mb-6 transition-colors"
        >
          <HiOutlineArrowLeft className="h-4 w-4" />
          Back to Orders
        </Link>
        <div className="flex flex-col items-center justify-center py-20">
          <HiOutlineExclamationCircle className="h-12 w-12 text-red-400 mb-4" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  if (!order) return null

  const currentStatusInfo = statusOptions.find((s) => s.value === fulfillmentStatus) || statusOptions[0]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back link */}
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white transition-colors"
      >
        <HiOutlineArrowLeft className="h-4 w-4" />
        Back to Orders
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Order Details</h1>
          <p className="text-zinc-400 text-sm mt-1 font-mono">{order.id}</p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border ${
              currentStatusInfo.bg} ${currentStatusInfo.color} ${currentStatusInfo.border
            }`}
          >
            <currentStatusInfo.icon className="h-4 w-4" />
            {currentStatusInfo.label}
          </span>
        </div>
      </div>

      {/* Success / Error banners */}
      {success && (
        <div className="rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3">
          <p className="text-green-400 text-sm">{success}</p>
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — order info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Line items */}
          <div className="rounded-xl border border-zinc-800 bg-[#0f0f0f] overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-800">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <HiOutlineCube className="h-4 w-4 text-zinc-400" />
                Items ({order.line_items?.length || 0})
              </h2>
            </div>
            {(!order.line_items || order.line_items.length === 0) ? (
              <div className="px-6 py-8 text-center text-zinc-500 text-sm">No line items</div>
            ) : (
              <div className="divide-y divide-zinc-800/50">
                {order.line_items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 px-6 py-4">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name || 'Product'}
                        className="h-14 w-14 rounded-lg object-cover bg-zinc-800"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {item.name || 'Unknown Product'}
                      </p>
                      {item.variant_label && (
                        <p className="text-xs text-zinc-500 mt-0.5">{item.variant_label}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-white">
                        ${(item.price || 0).toFixed(2)}
                      </p>
                      <p className="text-xs text-zinc-500">Qty: {item.quantity || 1}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Fulfillment controls */}
          <div className="rounded-xl border border-zinc-800 bg-[#0f0f0f] p-6 space-y-4">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <HiOutlineTruck className="h-4 w-4 text-zinc-400" />
              Fulfillment
            </h2>

            {/* Status buttons */}
            <div className="flex flex-wrap gap-2">
              {statusOptions.filter((s) => s.value !== 'cancelled').map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFulfillmentStatus(opt.value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    fulfillmentStatus === opt.value
                      ? `${opt.bg} ${opt.color} ${opt.border} ring-1 ring-${opt.value === 'pending' ? 'yellow' : opt.value === 'processing' ? 'blue' : opt.value === 'shipped' ? 'purple' : 'green'}-500/30`
                      : 'text-zinc-400 border-zinc-700 hover:border-zinc-600 hover:text-zinc-300'
                  }`}
                >
                  <opt.icon className="h-3.5 w-3.5" />
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Tracking number */}
            <div>
              <label className="block text-xs text-zinc-500 mb-1.5">Tracking Number</label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Optional tracking number..."
                className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700]"
              />
            </div>
          </div>

          {/* Admin notes */}
          <div className="rounded-xl border border-zinc-800 bg-[#0f0f0f] p-6 space-y-3">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <HiOutlineDocumentText className="h-4 w-4 text-zinc-400" />
              Admin Notes
            </h2>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add internal notes about this order..."
              className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700] resize-none"
            />
          </div>

          {/* Save button */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 rounded-lg bg-[#FFD700] text-black font-medium text-sm hover:bg-[#FFD700]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
            <button
              onClick={handleResendConfirmation}
              disabled={resending}
              className="px-6 py-2.5 rounded-lg border border-zinc-700 text-zinc-300 font-medium text-sm hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {resending ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
                  Resending...
                </>
              ) : (
                <>
                  <HiOutlineEnvelope className="h-4 w-4" />
                  Resend Confirmation
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right column — customer & payment */}
        <div className="space-y-4">
          {/* Customer info */}
          <div className="rounded-xl border border-zinc-800 bg-[#0f0f0f] p-5 space-y-3">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <HiOutlineEnvelope className="h-4 w-4 text-zinc-400" />
              Customer
            </h2>
            <p className="text-sm text-zinc-300">{order.customer_email}</p>
          </div>

          {/* Shipping address */}
          <div className="rounded-xl border border-zinc-800 bg-[#0f0f0f] p-5 space-y-3">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <HiOutlineMapPin className="h-4 w-4 text-zinc-400" />
              Shipping Address
            </h2>
            <p className="text-sm text-zinc-300 whitespace-pre-line">
              {formatAddress(order.shipping_address)}
            </p>
          </div>

          {/* Payment */}
          <div className="rounded-xl border border-zinc-800 bg-[#0f0f0f] p-5 space-y-3">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <HiOutlineCreditCard className="h-4 w-4 text-zinc-400" />
              Payment
            </h2>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Status</span>
              <span
                className={`text-sm font-medium ${
                  paymentColors[order.payment_status] || 'text-zinc-400'
                }`}
              >
                {order.payment_status || 'pending'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Subtotal</span>
              <span className="text-sm text-white">${(order.subtotal || order.total || 0).toFixed(2)}</span>
            </div>
            {order.shipping_cost !== undefined && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Shipping</span>
                <span className="text-sm text-white">${Number(order.shipping_cost).toFixed(2)}</span>
              </div>
            )}
            {order.tax !== undefined && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Tax</span>
                <span className="text-sm text-white">${Number(order.tax).toFixed(2)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-zinc-800">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white">Total</span>
                <span className="text-sm font-bold text-[#FFD700]">
                  ${(order.total || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="rounded-xl border border-zinc-800 bg-[#0f0f0f] p-5 space-y-2">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <HiOutlineTag className="h-4 w-4 text-zinc-400" />
              Details
            </h2>
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">Created</span>
              <span className="text-xs text-zinc-300">
                {new Date(order.created_at).toLocaleString()}
              </span>
            </div>
            {order.updated_at && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">Updated</span>
                <span className="text-xs text-zinc-300">
                  {new Date(order.updated_at).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
