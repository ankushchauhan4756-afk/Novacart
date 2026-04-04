import React from 'react'
import { CheckCircle, Clock, Truck, AlertCircle } from 'lucide-react'

const statusSteps = [
  { key: 'pending', label: 'Order Placed', icon: AlertCircle },
  { key: 'processing', label: 'Processing', icon: Clock },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle },
]

const getStatusClass = (isActive) =>
  isActive
    ? 'bg-primary-600 text-white border-primary-600'
    : 'bg-gray-200 text-gray-600 border-gray-300'

export default function TrackingTimeline({ history = [], currentStatus }) {
  const currentIndex = statusSteps.findIndex((step) => step.key === currentStatus)

  return (
    <div className="mt-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        {statusSteps.map((step, index) => {
          const StepIcon = step.icon
          const isCompleted = index <= currentIndex
          const entry = history.find((item) => item.status === step.key)
          return (
            <div key={step.key} className="flex flex-col items-center text-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${getStatusClass(isCompleted)}`}>
                <StepIcon size={18} />
              </div>
              <p className={`mt-2 text-xs font-semibold ${isCompleted ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400'}`}>
                {step.label}
              </p>
              {entry && (
                <p className="mt-2 text-[11px] text-gray-500 dark:text-gray-400">
                  {entry.location}
                  <br />
                  {new Date(entry.timestamp).toLocaleString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    day: '2-digit',
                    month: 'short',
                  })}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
