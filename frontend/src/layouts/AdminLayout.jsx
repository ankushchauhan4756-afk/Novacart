import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import AdminSidebar from '../components/AdminSidebar'

export default function AdminLayout() {
  const { user } = useStore()

  if (!user?.isAdmin) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
