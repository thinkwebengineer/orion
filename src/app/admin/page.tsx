'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  HiOutlineShoppingBag,
  HiOutlineCube,
  HiOutlineTruck,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineArrowRight,
} from 'react-icons/hi2'

interface DashboardStats {
  totalOrders: number
  ordersByStatus: Record<string, number>
  totalProducts: number
  recentOrders: Array<{
    id: string
    customer_email: string
    total: number
    fulfillment_status: string
    payment_status: string
    created_at: string
  }>
}

const statusColors: Record<string, string> = {
  pending: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  processing: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  shipped: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  delivered: 'text-green-400 bg-green-500/10 border-green-500/20',
  cancelled: 'text-red-400 bg-red-500/10 border-red-500/20',
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [_loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/admin/orders?limit=10')
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || 'Failed to load orders')
        }
        const { orders, count } = await res.json()

        // Compute status breakdown
        const ordersByStatus: Record<string, number> = {}
        for (const order of orders || []) {
          const status = order.fulfillment_status || 'pending'
          ordersByStatus[status] = (ordersByStatus[status] || 0) + 1
        }

        // Get product count
        let totalProducts = 0
        try {
          const prodRes = await fetch('/api/admin/products?limit=1')
          if (prodRes.ok) {
            const prodData = await prodRes.json()
            totalProducts = prodData.count || 0
          }
        } catch {
          // non-fatal
        }

        setStats({
          totalOrders: count || orders?.length || 0,
          ordersByStatus,
          totalProducts,
          recentOrders: (orders || []).slice(0, 10),
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <HiOutlineExclamationCircle className="h-12 w-12 text-red-400 mb-4" />
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#FFD700] border-t-transparent" />
      </div>
    )
  }

  const statusCards = [
    {
      label: 'Pending',
      value: stats.ordersByStatus['pending'] || 0,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      icon: HiOutlineClock,
    },
    {
      label: 'Processing',
      value: stats.ordersByStatus['processing'] || 0,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      icon: HiOutlineTruck,
    },
    {
      label: 'Shipped',
      value: stats.ordersByStatus['shipped'] || 0,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      icon: HiOutlineTruck,
    },
    {
      label: 'Delivered',
      value: stats.ordersByStatus['delivered'] || 0,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      icon: HiOutlineCheckCircle,
    },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-zinc-400 text-sm mt-1">Overview of your store performance</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Orders */}
        <div className="rounded-xl border border-zinc-800 bg-[#0f0f0f] p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-zinc-400 text-xs uppercase tracking-wider">Total Orders</span>
            <div className="rounded-lg bg-[#FFD700]/10 p-2">
              <HiOutlineShoppingBag className="h-4 w-4 text-[#FFD700]" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{stats.totalOrders}</p>
        </div>

        {/* Total Products */}
        <div className="rounded-xl border border-zinc-800 bg-[#0f0f0f] p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-zinc-400 text-xs uppercase tracking-wider">Products</span>
            <div className="rounded-lg bg-purple-500/10 p-2">
              <HiOutlineCube className="h-4 w-4 text-purple-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{stats.totalProducts}</p>
        </div>

        {/* Pending Orders */}
        <div className="rounded-xl border border-zinc-800 bg-[#0f0f0f] p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-zinc-400 text-xs uppercase tracking-wider">Pending</span>
            <div className="rounded-lg bg-yellow-500/10 p-2">
              <HiOutlineClock className="h-4 w-4 text-yellow-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{stats.ordersByStatus['pending'] || 0}</p>
        </div>

        {/* Shipped */}
        <div className="rounded-xl border border-zinc-800 bg-[#0f0f0f] p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-zinc-400 text-xs uppercase tracking-wider">In Transit</span>
            <div className="rounded-lg bg-blue-500/10 p-2">
              <HiOutlineTruck className="h-4 w-4 text-blue-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">
            {(stats.ordersByStatus['processing'] || 0) + (stats.ordersByStatus['shipped'] || 0)}
          </p>
        </div>
      </div>

      {/* Status breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statusCards.map((card) => (
          <div
            key={card.label}
            className={`rounded-lg border border-zinc-800 ${card.bg} p-3 text-center`}
          >
            <card.icon className={`h-5 w-5 ${card.color} mx-auto mb-1`} />
            <p className={`text-lg font-bold ${card.color}`}>{card.value}</p>
            <p className="text-xs text-zinc-500">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="rounded-xl border border-zinc-800 bg-[#0f0f0f] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <h2 className="text-sm font-semibold text-white">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1 text-xs text-[#FFD700] hover:text-[#FFD700]/80 transition-colors"
          >
            View All
            <HiOutlineArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {stats.recentOrders.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <HiOutlineShoppingBag className="h-10 w-10 text-zinc-600 mx-auto mb-3" />
            <p className="text-zinc-500 text-sm">No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800/50">
                  <th className="text-left px-6 py-3 text-zinc-500 font-medium text-xs uppercase tracking-wider">
                    Order #
                  </th>
                  <th className="text-left px-6 py-3 text-zinc-500 font-medium text-xs uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="text-left px-6 py-3 text-zinc-500 font-medium text-xs uppercase tracking-wider">
                    Total
                  </th>
                  <th className="text-left px-6 py-3 text-zinc-500 font-medium text-xs uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-zinc-500 font-medium text-xs uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-zinc-800/30 hover:bg-zinc-800/20 transition-colors"
                  >
                    <td className="px-6 py-3">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-[#FFD700] hover:underline font-mono text-xs"
                      >
                        {order.id.slice(0, 8)}...
                      </Link>
                    </td>
                    <td className="px-6 py-3 text-zinc-300">{order.customer_email}</td>
                    <td className="px-6 py-3 text-white font-medium">
                      ${(order.total || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-medium border ${
                          statusColors[order.fulfillment_status] || 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20'
                        }`}
                      >
                        {order.fulfillment_status || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-zinc-400 text-xs">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
