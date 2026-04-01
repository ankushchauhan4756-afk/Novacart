import React, { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import MobileMenu from '../components/MobileMenu'

export default function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <Navbar 
        onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        menuOpen={mobileMenuOpen}
      />
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      
      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}
