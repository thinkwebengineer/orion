'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  HiOutlineShoppingBag,
  HiOutlineMagnifyingGlass,
  HiOutlineFunnel,
  HiOutlineExclamationCircle,
  HiOutlineArrowRight,
} from 'react-icons/hi2'

interface Order {
  id: string
  customer_email: string
  total: number
  fulfillment_status: string
  payment_status: string
  created_at: string
  line_items?: Array<{ quantity: number }>
}

const statusTabs = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
]

const statusColors: Record<string, string> = {
  pending: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  processing: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  shipped: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  delivered: 'text-green-400 bg-green-500/10 border-green-500/20',
  cancelled: 'text-red-400 bg-red-500/10 border-red-500/20',
}

const paymentColors: Record<string, string> = {
  pending: 'text-yellow-400',
  confirmed: 'text-green-400',
  failed: 'text-red-400',
}

export default function AdminOrdersList() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        if (statusFilter) params.set('status', statusFilter)
        params.set('limit', '100')

        const res = await fetch(`/api/admin/orders?${params.toString()}`)
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || 'Failed to load orders')
        }
        const data = await res.json()
        setOrders(data.orders || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [statusFilter])

  const filteredOrders = searchQuery
    ? orders.filter((o) =>
        o.customer_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.id.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : orders

  const totalVariants = (items: Array<{ quantity: number }> | undefined) => {
    if (!items || items.length === 0) return 0
    return items.reduce((sum, item) => sum + (item.quantity || 1), 0)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Orders</h1>
        <p className="text-zinc-400 text-sm mt-1">Manage and fulfill customer orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by email or order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#FFD700] focus:border-[#FFD700]"
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 w-full sm:w-auto">
          <HiOutlineFunnel className="h-4 w-4 text-zinc-500 flex-shrink-0" />
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                statusFilter === tab.value
                  ? 'bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20'
                  : 'text-zinc-400 hover:text-white border border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#FFD700] border-t-transparent" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20">
          <HiOutlineExclamationCircle className="h-12 w-12 text-red-400 mb-4" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-xl border border-dashed border-zinc-800">
          <HiOutlineShoppingBag className="h-12 w-12 text-zinc-600 mb-4" />
          <p className="text-zinc-500 text-sm mb-2">No orders found</p>
          <p className="text-zinc-600 text-xs">
            {searchQuery
              ? 'Try a different search term'
              : 'No orders match the selected filter'}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-800 bg-[#0f0f0f] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800/50">
                  <th className="text-left px-6 py-4 text-zinc-500 font-medium text-xs uppercase tracking-wider">
                    Order #
                  </th>
                  <th className="text-left px-6 py-4 text-zinc-500 font-medium text-xs uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="text-left px-6 py-4 text-zinc-500 font-medium text-xs uppercase tracking-wider">
                    Items
                  </th>
                  <th className="text-left px-6 py-4 text-zinc-500 font-medium text-xs uppercase tracking-wider">
                    Total
                  </th>
                  <th className="text-left px-6 py-4 text-zinc-500 font-medium text-xs uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="text-left px-6 py-4 text-zinc-500 font-medium text-xs uppercase tracking-wider">
                    Fulfillment
                  </th>
                  <th className="text-left px-6 py-4 text-zinc-500 font-medium text-xs uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-right px-6 py-4" />
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-zinc-800/30 hover:bg-zinc-800/20 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="text-zinc-300 font-mono text-xs">
                        {order.id.slice(0, 8)}...
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-300">{order.customer_email}</td>
                    <td className="px-6 py-4 text-zinc-400">
                      {totalVariants(order.line_items)} items
                    </td>
                    <td className="px-6 py-4 text-white font-medium">
                      ${(order.total || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-medium ${
                          paymentColors[order.payment_status] || 'text-zinc-400'
                        }`}
                      >
                        {order.payment_status || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-medium border ${
                          statusColors[order.fulfillment_status] || 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20'
                        }`}
                      >
                        {order.fulfillment_status || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-400 text-xs">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex items-center gap-1 text-xs text-[#FFD700] hover:text-[#FFD700]/80 transition-colors"
                      >
                        View
                        <HiOutlineArrowRight className="h-3 w-3" />
                      </Link>
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
