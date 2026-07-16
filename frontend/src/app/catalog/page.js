'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { apiRequest } from '../../utils/api';
import { Search, Loader2, Home, Bed, Bath, Layers, MapPin } from 'lucide-react';

export default function CatalogPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Filter States
  const [city, setCity] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (city) queryParams.append('city', city);
      if (propertyType) queryParams.append('propertyType', propertyType);
      if (bedrooms) queryParams.append('bedrooms', bedrooms);
      if (maxPrice) queryParams.append('maxPrice', maxPrice);

      const res = await apiRequest(`/properties?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProperties(data.data.properties);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProperties();
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col selection:bg-caramel/30 selection:text-brownie">
      {/* Navigation */}
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Search Bar Grid */}
        <section className="bg-cream/40 border border-caramel/25 p-6 rounded-3xl shadow-sm mb-10">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-end">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-[10px] font-bold text-coffee uppercase tracking-wider">Search by City</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-caramel" />
                <input 
                  type="text" 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Madurai"
                  className="w-full pl-10 pr-4 py-3 bg-cream/10 border border-caramel/25 rounded-2xl text-brownie placeholder-coffee/40 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-caramel"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-coffee uppercase tracking-wider">Property Type</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-4 py-3.5 bg-cream/10 border border-caramel/25 rounded-2xl text-brownie text-sm font-semibold focus:outline-none"
              >
                <option value="">All Types</option>
                <option value="HOUSE">House</option>
                <option value="APARTMENT">Apartment</option>
                <option value="VILLA">Villa</option>
                <option value="LAND">Land</option>
                <option value="COMMERCIAL">Commercial</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-coffee uppercase tracking-wider">Max Budget (₹)</label>
              <input 
                type="number" 
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max price"
                className="w-full px-4 py-3 bg-cream/10 border border-caramel/25 rounded-2xl text-brownie placeholder-coffee/40 text-sm font-semibold focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-brownie hover:bg-caramel text-cream font-bold rounded-2xl shadow-md transition-colors flex items-center justify-center gap-1.5"
            >
              <Search className="h-4 w-4" />
              Search
            </button>
          </form>
        </section>

        {/* Catalog Feed */}
        <section className="space-y-6">
          <div className="flex justify-between items-center border-b border-caramel/10 pb-4">
            <h2 className="text-xl font-extrabold text-brownie">Available Listings ({properties.length})</h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brownie h-10 w-10" /></div>
          ) : properties.length === 0 ? (
            <div className="p-16 border border-dashed border-caramel/20 rounded-3xl text-center text-coffee font-semibold">
              No matching properties found. Try clearing your filters or searching another city.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {properties.map((property) => (
                <Link 
                  key={property.id} 
                  href={`/catalog/${property.id}`}
                  className="group bg-cream/40 border border-caramel/20 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg hover:border-caramel/60 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="h-48 bg-coffee/10 relative overflow-hidden">
                    {property.images && property.images.length > 0 ? (
                      <img 
                        src={property.images.find(img => img.isPrimary)?.url || property.images[0].url} 
                        alt={property.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-coffee font-bold">No Image</div>
                    )}
                    <span className="absolute bottom-3 left-3 bg-brownie text-cream text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {property.propertyType.toLowerCase()}
                    </span>
                  </div>

                  <div className="p-5 flex-grow space-y-3">
                    <span className="text-caramel font-extrabold text-xs flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {property.areaLocality?.name}, {property.city?.name}
                    </span>
                    <h3 className="font-extrabold text-brownie text-base group-hover:text-caramel transition-colors line-clamp-1">
                      {property.title}
                    </h3>
                    
                    <div className="flex justify-between items-center border-t border-caramel/10 pt-3">
                      <span className="text-base font-extrabold text-brownie">₹{property.price.toLocaleString('en-IN')}</span>
                      <span className="text-xs text-coffee font-semibold">{property.area} Sq.Ft.</span>
                    </div>

                    <div className="flex gap-4 text-xs font-semibold text-coffee/80 pt-1">
                      <span className="flex items-center gap-1"><Bed className="h-4 w-4 text-caramel" /> {property.bedrooms} Bed</span>
                      <span className="flex items-center gap-1"><Bath className="h-4 w-4 text-caramel" /> {property.bathrooms} Bath</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

      </main>

      <Footer />
    </div>
  );
}
