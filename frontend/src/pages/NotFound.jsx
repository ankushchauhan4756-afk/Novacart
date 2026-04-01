import React from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, Home } from 'lucide-react'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="section-container py-20 text-center">
      <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
        <AlertCircle size={60} className="text-red-600" />
      </div>
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
        Oops! The page you're looking for doesn't exist.
      </p>
      <button
        onClick={() => navigate('/')}
        className="btn-primary inline-flex items-center gap-2"
      >
        <Home size={20} />
        Back to Home
      </button>
    </div>
  )
}
