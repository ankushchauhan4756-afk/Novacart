import React from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 mt-20">
      <div className="section-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                NC
              </div>
              <span className="font-bold text-lg gradient-text">NovaCart</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Premium e-commerce platform offering a stunning shopping experience with quality products and exceptional service.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary-600 transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-primary-600 transition">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-primary-600 transition">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-primary-600 transition">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 transition">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold text-lg mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/category/fashion" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 transition">
                  Fashion
                </Link>
              </li>
              <li>
                <Link to="/category/clothes" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 transition">
                  Clothes
                </Link>
              </li>
              <li>
                <Link to="/category/tech-gadgets" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 transition">
                  Tech Gadgets
                </Link>
              </li>
              <li>
                <Link to="/category/fruits" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 transition">
                  Fruits
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail size={18} className="text-primary-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-600 dark:text-gray-400">ankushchauhan4756@gmail.com</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Phone size={18} className="text-primary-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-600 dark:text-gray-400">7983684876</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={18} className="text-primary-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Vijay Nagar, Ghaziabad</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600 dark:text-gray-400">
            <p>&copy; {currentYear} NovaCart. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/" className="hover:text-primary-600 transition">
                Privacy Policy
              </Link>
              <Link to="/" className="hover:text-primary-600 transition">
                Terms of Service
              </Link>
              <Link to="/" className="hover:text-primary-600 transition">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
