'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brownie text-cream/80 border-t border-caramel/20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-caramel shadow-md">
                <Home className="h-4 w-4 text-cream" />
              </div>
              <span className="font-extrabold text-lg text-cream tracking-tight">
                Jose Estate
              </span>
            </div>
            <p className="text-sm text-cream/70 leading-relaxed">
              Experience the evolution of real estate. We offer a curated experience for verified buyers and sellers seeking premium homes.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-extrabold text-cream uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="#" className="hover:text-caramel transition-colors">Featured Homes</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-caramel transition-colors">Pricing Structure</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-caramel transition-colors">Terms of Use</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-caramel transition-colors">Privacy Policy</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-extrabold text-cream uppercase tracking-wider mb-4">Contact Info</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-caramel mt-0.5" />
                <span>120 Luxury Avenue, Suite 10, New York</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-caramel" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-caramel" />
                <span>contact@joseestate.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Input */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-cream uppercase tracking-wider mb-4">Join Newsletter</h3>
            <p className="text-xs text-cream/70">Subscribe to receive first access notifications for premium estate drops.</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full px-4 py-3 bg-cream/5 border border-caramel/20 rounded-xl text-cream placeholder-cream/40 text-xs focus:outline-none focus:ring-1 focus:ring-caramel"
              />
              <button className="absolute right-1 top-1 h-8 w-8 rounded-lg bg-caramel hover:bg-caramel/80 flex items-center justify-center text-cream transition-colors">
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Copywrite and disclaimer */}
        <div className="border-t border-caramel/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream/50">
          <p>© {new Date().getFullYear()} Jose Estate. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:underline">Legal</a>
            <a href="#" className="hover:underline">Sitemap</a>
            <a href="#" className="hover:underline">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
