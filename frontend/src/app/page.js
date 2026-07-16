'use client';

import React from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollReveal from '../components/ScrollReveal';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Search, Shield, Building, Compass, Sparkles } from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-cream flex flex-col selection:bg-caramel/30 selection:text-brownie">
      {/* Header Navigation */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow">
        {/* Parallax Hero Section */}
        <section 
          className="relative min-h-[85vh] flex items-center justify-center bg-fixed bg-cover bg-center py-24 sm:py-32"
          style={{ backgroundImage: "url('/jose-bg.png')" }}
        >
          {/* Dark Overlay Tint for Readability */}
          <div className="absolute inset-0 bg-brownie/65 backdrop-blur-[1px]" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center text-cream">
            {/* Tagline Pill */}
            <ScrollReveal direction="up" delay={200}>
              <div className="inline-flex items-center gap-1.5 px-4.5 py-1.5 rounded-full bg-caramel/25 border border-caramel/40 text-cream text-xs font-bold uppercase tracking-wider mb-6 animate-bounce duration-[4s]">
                <Sparkles className="h-3.5 w-3.5 text-caramel" />
                Elevating Real Estate Search
              </div>
            </ScrollReveal>

            {/* Main Headline */}
            <ScrollReveal direction="left" delay={400}>
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto mb-6">
                The premium gateway to <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-caramel via-cream to-caramel animate-pulse">
                  your dream properties
                </span>
              </h1>
            </ScrollReveal>

            {/* Sub-headline */}
            <ScrollReveal direction="right" delay={600}>
              <p className="text-base sm:text-xl text-cream/90 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
                Browse thousands of certified luxury property listings, villas, and plots. Interact directly with verified sellers in a seamless, secure ecosystem.
              </p>
            </ScrollReveal>

            {/* CTAs */}
            <ScrollReveal direction="up" delay={800}>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <Link 
                  href={isAuthenticated ? "/dashboard" : "/register"}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-caramel hover:bg-caramel/90 text-cream font-bold text-base transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-caramel/20"
                >
                  {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link 
                  href="#"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-transparent border border-cream/40 hover:bg-cream/10 text-cream font-bold text-base transition-all duration-300"
                >
                  <Search className="h-5 w-5 text-caramel" />
                  Browse Catalog
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Feature Cards Grid Section */}
        <section className="py-24 bg-cream border-t border-caramel/15 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal direction="up">
              <div className="text-center mb-20">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-brownie tracking-tight">
                  Designed for Buyers, Sellers, and Agents
                </h2>
                <p className="text-coffee mt-3 font-medium text-base">
                  Experience high-performance property searches and automated inquiry tracking.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 - Left Slide */}
              <ScrollReveal direction="left" delay={100}>
                <div className="bg-cream/40 border border-caramel/20 p-8 rounded-3xl hover:border-caramel hover:shadow-xl hover:shadow-caramel/5 transition-all duration-300 group">
                  <div className="h-12 w-12 rounded-2xl bg-caramel/15 text-caramel flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                    <Compass className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-brownie mb-2">Detailed Local Search</h3>
                  <p className="text-sm text-coffee/80 leading-relaxed font-medium">
                    Perform optimized queries by location, city, pricing, bedroom counts, or property class to find exactly what you want.
                  </p>
                </div>
              </ScrollReveal>

              {/* Feature 2 - Up Slide */}
              <ScrollReveal direction="up" delay={200}>
                <div className="bg-cream/40 border border-caramel/20 p-8 rounded-3xl hover:border-caramel hover:shadow-xl hover:shadow-caramel/5 transition-all duration-300 group">
                  <div className="h-12 w-12 rounded-2xl bg-caramel/15 text-caramel flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                    <Building className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-brownie mb-2">Direct Owner Listings</h3>
                  <p className="text-sm text-coffee/80 leading-relaxed font-medium">
                    Owners can create listings, manage visual asset grids, and directly answer buyer inquiries from their personal dashboard.
                  </p>
                </div>
              </ScrollReveal>

              {/* Feature 3 - Right Slide */}
              <ScrollReveal direction="right" delay={300}>
                <div className="bg-cream/40 border border-caramel/20 p-8 rounded-3xl hover:border-caramel hover:shadow-xl hover:shadow-caramel/5 transition-all duration-300 group">
                  <div className="h-12 w-12 rounded-2xl bg-caramel/15 text-caramel flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                    <Shield className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-brownie mb-2">Verified Connections</h3>
                  <p className="text-sm text-coffee/80 leading-relaxed font-medium">
                    Inquiries are guarded by rate-limit protections and duplicate validation filters to block spam and verify client leads.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* CTA Banner Area */}
        <section className="pb-28 bg-cream relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl bg-brownie p-8 sm:p-16 text-center overflow-hidden border border-caramel/25 shadow-2xl">
              {/* Overlay styling elements */}
              <div className="absolute -top-[50px] -right-[50px] w-[180px] h-[180px] rounded-full bg-caramel/15 blur-[60px]" />
              <div className="absolute -bottom-[50px] -left-[50px] w-[180px] h-[180px] rounded-full bg-coffee/15 blur-[60px]" />

              <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                <ScrollReveal direction="left">
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-cream tracking-tight">
                    Ready to discover your next home?
                  </h2>
                </ScrollReveal>
                
                <ScrollReveal direction="right">
                  <p className="text-cream/80 text-sm sm:text-base leading-relaxed">
                    Join Jose Estate today. Complete a fast account setup, select your profile type, and get direct access to premium property catalogs.
                  </p>
                </ScrollReveal>

                <ScrollReveal direction="up" delay={200}>
                  <div className="pt-4">
                    <Link 
                      href={isAuthenticated ? "/dashboard" : "/register"}
                      className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-caramel hover:bg-caramel/90 text-cream font-extrabold text-sm transition-colors shadow-lg shadow-caramel/15"
                    >
                      {isAuthenticated ? 'Enter Dashboard' : 'Create Free Account'}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Details */}
      <Footer />
    </div>
  );
}
