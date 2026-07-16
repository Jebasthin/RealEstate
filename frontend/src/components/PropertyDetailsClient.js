'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../utils/api';
import { MapPin, Bed, Bath, Shield, MessageSquare, User, Check, Loader2 } from 'lucide-react';

export default function PropertyDetailsClient({ property }) {
  const { isAuthenticated } = useAuth();
  const [enquiryMsg, setEnquiryMsg] = useState('I am interested in this property. Please contact me with more details.');
  const [enquiryLoading, setEnquiryLoading] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState('');
  const [enquiryError, setEnquiryError] = useState('');

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    setEnquiryError('');
    setEnquirySuccess('');
    setEnquiryLoading(true);

    try {
      const res = await apiRequest('/enquiries', {
        method: 'POST',
        body: JSON.stringify({
          propertyId: property.id,
          message: enquiryMsg,
        }),
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.message || 'Failed to submit enquiry.');
      }

      setEnquirySuccess(resData.message || 'Enquiry sent! The owner has been notified.');
      setEnquiryMsg('');
    } catch (err) {
      setEnquiryError(err.message);
    } finally {
      setEnquiryLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Gallery Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-left opacity-0 [animation-fill-mode:forwards]">
        <div className="lg:col-span-2 h-[450px] bg-coffee/20 rounded-3xl overflow-hidden shadow-sm">
          {property.images && property.images.length > 0 ? (
            <img 
              src={property.images.find(img => img.isPrimary)?.url || property.images[0].url} 
              alt={property.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-coffee font-bold">No Image</div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4 h-[450px]">
          {property.images && property.images.filter(img => !img.isPrimary).slice(0, 4).map((img, index) => (
            <div key={img.id} className="h-full bg-coffee/20 rounded-2xl overflow-hidden relative shadow-sm">
              <img src={img.url} alt="Room" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
          {(!property.images || property.images.filter(img => !img.isPrimary).length === 0) && (
            <div className="col-span-2 h-full flex items-center justify-center border border-dashed border-caramel/25 rounded-2xl text-coffee text-xs font-bold">
              No Additional Photos
            </div>
          )}
        </div>
      </section>

      {/* Main Details and Side Action Card */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* Main Info - slides in from the Left */}
        <div className="lg:col-span-2 space-y-8 animate-slide-left opacity-0 [animation-fill-mode:forwards]">
          {/* Header info */}
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 text-caramel font-extrabold text-sm uppercase">
              <MapPin className="h-4 w-4" />
              {property.areaLocality?.name}, {property.city?.name}, {property.state?.name}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-brownie tracking-tight leading-tight">
              {property.title}
            </h1>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-y border-caramel/15 py-6">
            <div>
              <span className="block text-[10px] font-bold text-coffee uppercase tracking-wider mb-1">Pricing</span>
              <span className="text-xl font-extrabold text-brownie">₹{property.price.toLocaleString('en-IN')}</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-coffee uppercase tracking-wider mb-1">Area</span>
              <span className="text-xl font-extrabold text-brownie">{property.area} Sq.Ft.</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-coffee uppercase tracking-wider mb-1">Bedrooms</span>
              <span className="text-xl font-extrabold text-brownie">{property.bedrooms} BHK</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-coffee uppercase tracking-wider mb-1">Bathrooms</span>
              <span className="text-xl font-extrabold text-brownie">{property.bathrooms} Baths</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-brownie">Description</h3>
            <p className="text-sm text-coffee/90 leading-relaxed font-medium whitespace-pre-line">
              {property.description || 'No description available for this property listing.'}
            </p>
          </div>

          {/* Amenities Checklists */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-brownie">Amenities</h3>
            {property.amenities && property.amenities.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {property.amenities.map(({ amenity }) => (
                  <div key={amenity.id} className="flex items-center gap-2.5 text-sm font-semibold text-coffee">
                    <div className="flex items-center justify-center h-5.5 w-5.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <span>{amenity.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-coffee font-medium">No amenities listed.</p>
            )}
          </div>
        </div>

        {/* Side Inquiry Box - slides in from the Right */}
        <div className="lg:col-span-1 space-y-6 animate-slide-right opacity-0 [animation-fill-mode:forwards]">
          {/* Contact Form Card */}
          <div className="bg-cream/40 border border-caramel/25 p-6 rounded-3xl shadow-sm space-y-6">
            <h3 className="font-bold text-brownie text-lg flex items-center gap-2 border-b border-caramel/15 pb-4">
              <MessageSquare className="h-5 w-5 text-caramel" />
              Contact Owner
            </h3>

            {/* Owner card info */}
            <div className="flex items-center gap-3 bg-cream/15 p-4 rounded-2xl border border-caramel/10">
              <div className="h-10 w-10 rounded-full bg-cream border border-caramel/20 flex items-center justify-center text-brownie">
                <User className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-brownie text-sm leading-tight">{property.owner.fullName}</h4>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] text-coffee uppercase font-bold tracking-wider">{property.owner.role}</span>
                  {property.owner.mobile && (
                    <span className="text-[10px] text-brownie/90 font-semibold">{property.owner.mobile}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Form implementation */}
            {isAuthenticated ? (
              <form onSubmit={handleEnquirySubmit} className="space-y-4">
                {enquiryError && <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-800 text-xs font-semibold">{enquiryError}</div>}
                {enquirySuccess && <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs font-semibold">{enquirySuccess}</div>}

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-coffee uppercase tracking-wider block">Message</label>
                  <textarea
                    value={enquiryMsg}
                    onChange={(e) => setEnquiryMsg(e.target.value)}
                    rows={4}
                    required
                    className="w-full px-4 py-3 bg-cream/10 border border-caramel/25 rounded-2xl text-brownie placeholder-coffee/40 text-xs font-semibold focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={enquiryLoading || !enquiryMsg}
                  className="w-full py-3.5 bg-brownie hover:bg-caramel text-cream font-bold rounded-2xl shadow-sm text-xs transition-colors flex items-center justify-center"
                >
                  {enquiryLoading ? <Loader2 className="animate-spin h-4 w-4 mr-1" /> : 'Send Message'}
                </button>
              </form>
            ) : (
              <div className="text-center p-4 bg-caramel/5 border border-caramel/10 rounded-2xl space-y-3">
                <p className="text-xs text-coffee font-medium">Please sign in to contact the owner directly and schedule visits.</p>
                <Link href="/login" className="block w-full py-2.5 bg-brownie hover:bg-caramel text-cream text-xs font-bold rounded-xl transition-colors">
                  Sign In to Contact
                </Link>
              </div>
            )}
          </div>

          {/* Platform Security Badge */}
          <div className="bg-cream/20 border border-caramel/15 p-5 rounded-3xl flex gap-3 text-xs">
            <Shield className="h-5 w-5 text-caramel shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="font-bold text-brownie">Verified Jose Listing</h5>
              <p className="text-coffee/85 leading-relaxed font-medium">This property has been vetted and approved by our system administrators.</p>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}
