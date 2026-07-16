'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import AuthGuard from '../../../components/AuthGuard';
import { apiRequest } from '../../../utils/api';
import DashboardNavbar from '../../../components/DashboardNavbar';
import { useRouter } from 'next/navigation';
import { 
  PlusCircle, Loader2, MapPin, Bed, Bath, Trash2, Tag, ChevronLeft, ChevronRight, XCircle, Phone
} from 'lucide-react';

export default function SellerDashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('OVERVIEW'); // OVERVIEW, MY_LISTINGS, ADD_PROPERTY, LEADS
  const [copiedText, setCopiedText] = useState('');
  
  // Listings and Leads States (Seller)
  const [myListingsData, setMyListingsData] = useState([]);
  const [myLeadsData, setMyLeadsData] = useState([]);
  const [loadingLists, setLoadingLists] = useState(false);
  const [myListingsPage, setMyListingsPage] = useState(1);
  const [myListingsPagination, setMyListingsPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });
  const [nextViewId, setNextViewId] = useState(1);
  const [sellerFilterTitle, setSellerFilterTitle] = useState('');
  const [sellerFilterViewId, setSellerFilterViewId] = useState('');
  
  // Add Property Form States
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formArea, setFormArea] = useState('');
  const [formBedrooms, setFormBedrooms] = useState('2');
  const [formBathrooms, setFormBathrooms] = useState('2');
  const [formParking, setFormParking] = useState(false);
  const [formType, setFormType] = useState('HOUSE');
  const [formStateId, setFormStateId] = useState('');
  const [formCityId, setFormCityId] = useState('');
  const [formAreaId, setFormAreaId] = useState('');

  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [areasList, setAreasList] = useState([]);
  
  const [allAmenities, setAllAmenities] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]); // Array of base64 strings
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Role Guard Redirect
  useEffect(() => {
    if (user && user.role !== 'SELLER') {
      router.replace('/dashboard');
    }
  }, [user, router]);

  useEffect(() => {
    fetchAmenities();
    fetchStates();
    
    if (user?.role === 'SELLER') {
      fetchMyListings(myListingsPage, sellerFilterTitle, sellerFilterViewId);
      fetchMyLeads();
    }
    if (activeTab === 'ADD_PROPERTY') {
      fetchNextViewId();
    }
  }, [user, activeTab]);

  // Load cities cascading when state selection triggers (Add form)
  useEffect(() => {
    if (formStateId) {
      fetchCities(formStateId);
      setCitiesList([]);
      setAreasList([]);
      setFormCityId('');
      setFormAreaId('');
    }
  }, [formStateId]);

  // Load areas cascading when city selection triggers (Add form)
  useEffect(() => {
    if (formCityId) {
      fetchAreas(formCityId);
      setAreasList([]);
      setFormAreaId('');
    }
  }, [formCityId]);

  const fetchAmenities = async () => {
    try {
      const res = await apiRequest('/properties/amenities');
      if (res.ok) {
        const data = await res.json();
        setAllAmenities(data.data.amenities);
      }
    } catch (err) {
      console.error('Error fetching amenities:', err);
    }
  };

  const fetchStates = async () => {
    try {
      const res = await apiRequest('/locations/states');
      if (res.ok) {
        const data = await res.json();
        setStatesList(data.data.states);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCities = async (sId) => {
    try {
      const res = await apiRequest(`/locations/states/${sId}/cities`);
      if (res.ok) {
        const data = await res.json();
        setCitiesList(data.data.cities);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAreas = async (cId) => {
    try {
      const res = await apiRequest(`/locations/cities/${cId}/areas`);
      if (res.ok) {
        const data = await res.json();
        setAreasList(data.data.areas);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNextViewId = async () => {
    try {
      const res = await apiRequest('/properties/next-view-id');
      if (res.ok) {
        const data = await res.json();
        setNextViewId(data.nextViewId);
      }
    } catch (err) {
      console.error('Error fetching next view id:', err);
    }
  };

  const fetchMyListings = async (pageVal = myListingsPage, title = sellerFilterTitle, viewId = sellerFilterViewId) => {
    setLoadingLists(true);
    try {
      let query = `/properties/my-listings?page=${pageVal}&limit=10`;
      if (title) query += `&title=${encodeURIComponent(title)}`;
      if (viewId) query += `&viewId=${encodeURIComponent(viewId)}`;
      const res = await apiRequest(query);
      if (res.ok) {
        const data = await res.json();
        setMyListingsData(data.data.properties);
        if (data.pagination) {
          setMyListingsPagination(data.pagination);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLists(false);
    }
  };

  const handleSellerSearch = (e) => {
    e?.preventDefault();
    setMyListingsPage(1);
    fetchMyListings(1, sellerFilterTitle, sellerFilterViewId);
  };

  const handleSellerReset = () => {
    setSellerFilterTitle('');
    setSellerFilterViewId('');
    setMyListingsPage(1);
    fetchMyListings(1, '', '');
  };

  const handleMyListingsPageChange = (newPage) => {
    if (newPage < 1 || newPage > myListingsPagination.totalPages) return;
    setMyListingsPage(newPage);
    fetchMyListings(newPage);
  };

  const fetchMyLeads = async () => {
    try {
      const res = await apiRequest('/enquiries/my-leads');
      if (res.ok) {
        const data = await res.json();
        setMyLeadsData(data.data.enquiries);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Multi-Image Upload (FileReader to Base64 conversions)
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormError('');

    files.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        setFormError('Only image files are allowed.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImages((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAmenityToggle = (amenityId) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenityId)
        ? prev.filter((id) => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  // Submit Listing Form
  const handleAddPropertySubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setFormLoading(true);

    if (uploadedImages.length === 0) {
      setFormError('Please upload at least one image of the property.');
      setFormLoading(false);
      return;
    }

    try {
      const payload = {
        title: formTitle,
        description: formDesc,
        price: formPrice,
        area: formArea,
        bedrooms: formBedrooms,
        bathrooms: formBathrooms,
        parking: formParking,
        propertyType: formType,
        stateId: formStateId,
        cityId: formCityId,
        areaId: formAreaId,
        amenityIds: selectedAmenities,
        images: uploadedImages,
      };

      const res = await apiRequest('/properties', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.message || 'Failed to submit property.');
      }

      setFormSuccess('Property listing created and submitted for Admin verification!');
      setFormTitle('');
      setFormDesc('');
      setFormPrice('');
      setFormArea('');
      setFormStateId('');
      setFormCityId('');
      setFormAreaId('');
      setSelectedAmenities([]);
      setUploadedImages([]);
      
      setTimeout(() => {
        setActiveTab('MY_LISTINGS');
        setFormSuccess('');
      }, 3000);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  // Delete Property Listing
  const handleDeleteListing = async (pId) => {
    if (!window.confirm('Are you sure you want to delete this listing permanently?')) return;
    try {
      const res = await apiRequest(`/properties/${pId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchMyListings(myListingsPage);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Change Listing Status (e.g. SOLD)
  const handleChangeStatus = async (pId, newStatus) => {
    try {
      const res = await apiRequest(`/properties/${pId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchMyListings(myListingsPage);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReplyMail = (email, title) => {
    navigator.clipboard.writeText(email).then(() => {
      setCopiedText(email);
      setTimeout(() => setCopiedText(''), 3000);
    }).catch(err => console.error('Could not copy email:', err));
    
    window.location.href = `mailto:${email}?subject=Regarding your enquiry on ${encodeURIComponent(title)}`;
  };

  if (!user || user.role !== 'SELLER') {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-brownie h-10 w-10" />
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-cream flex flex-col selection:bg-caramel/30 selection:text-brownie">
        {/* Background Blurs */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-caramel/10 blur-[130px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-coffee/10 blur-[150px]" />
        </div>

        {/* Dashboard Navbar */}
        <DashboardNavbar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          role="SELLER"
          user={user}
          logout={logout}
        />

        {/* Main Dashboard Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow relative z-10 w-full">
          <main className="w-full">
            
            {/* OVERVIEW TAB */}
            {activeTab === 'OVERVIEW' && (
              <div className="space-y-6">
                <div className="mb-6">
                  <h1 className="text-3xl font-extrabold tracking-tight text-brownie animate-slide-left opacity-0 [animation-fill-mode:forwards]">Welcome back, {user?.fullName}!</h1>
                  <p className="text-coffee font-medium mt-1 animate-slide-left opacity-0 [animation-fill-mode:forwards]">Manage your listings, enquiries, and credentials.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-right opacity-0 [animation-fill-mode:forwards]">
                  <div className="bg-cream/40 border border-caramel/25 p-6 rounded-2xl shadow-sm">
                    <span className="block text-xs font-bold text-coffee uppercase tracking-wider mb-2">Registered Role</span>
                    <span className="text-2xl font-extrabold text-brownie uppercase">{user?.role}</span>
                  </div>
                  
                  <div className="bg-cream/40 border border-caramel/25 p-6 rounded-2xl shadow-sm">
                    <span className="block text-xs font-bold text-coffee uppercase tracking-wider mb-2">My Listings</span>
                    <span className="text-2xl font-extrabold text-brownie">{myListingsData.length}</span>
                  </div>
                  <div className="bg-cream/40 border border-caramel/25 p-6 rounded-2xl shadow-sm">
                    <span className="block text-xs font-bold text-coffee uppercase tracking-wider mb-2">Total Leads</span>
                    <span className="text-2xl font-extrabold text-brownie">{myLeadsData.length}</span>
                  </div>
                </div>

                <div className="bg-cream/40 border border-caramel/25 p-6 rounded-2xl shadow-sm mt-6 animate-slide-left opacity-0 [animation-fill-mode:forwards]">
                  <h3 className="font-extrabold text-brownie text-lg border-b border-caramel/15 pb-3 mb-4">Your Profile Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm font-semibold text-coffee">
                    <div>
                      <span className="block text-[10px] font-bold text-coffee/60 uppercase tracking-wider mb-1">Full Name</span>
                      <span className="text-brownie text-base font-extrabold">{user?.fullName}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-coffee/60 uppercase tracking-wider mb-1">Email Address</span>
                      <span className="text-brownie text-base font-extrabold">{user?.email}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-coffee/60 uppercase tracking-wider mb-1">Mobile Number</span>
                      <span className="text-brownie text-base font-extrabold">{user?.mobile || 'Not provided'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MY PROPERTIES TAB */}
            {activeTab === 'MY_LISTINGS' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-extrabold text-brownie">My Properties</h2>
                  <button 
                    onClick={() => setActiveTab('ADD_PROPERTY')} 
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brownie hover:bg-caramel text-cream font-bold text-xs transition-colors shadow-sm shadow-brownie/10 cursor-pointer"
                  >
                    <PlusCircle className="h-4 w-4" />
                    New Listing
                  </button>
                </div>

                {/* Seller Filters Panel */}
                <form onSubmit={handleSellerSearch} className="bg-cream/40 border border-caramel/25 p-5 rounded-3xl grid grid-cols-1 sm:grid-cols-3 gap-4 items-end shadow-sm">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-brownie uppercase tracking-wider block">Property Title</label>
                    <input 
                      type="text"
                      value={sellerFilterTitle}
                      onChange={(e) => setSellerFilterTitle(e.target.value)}
                      placeholder="e.g. BHK, Villa, House"
                      className="w-full px-4 py-2.5 bg-cream border border-caramel/20 rounded-xl text-xs text-brownie placeholder-coffee/40 font-medium focus:outline-none focus:ring-1 focus:ring-caramel"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-brownie uppercase tracking-wider block">View ID</label>
                    <input 
                      type="text"
                      value={sellerFilterViewId}
                      onChange={(e) => setSellerFilterViewId(e.target.value)}
                      placeholder="e.g. 1 or #1"
                      className="w-full px-4 py-2.5 bg-cream border border-caramel/20 rounded-xl text-xs text-brownie placeholder-coffee/40 font-medium focus:outline-none focus:ring-1 focus:ring-caramel"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      type="submit"
                      className="flex-grow py-2.5 rounded-xl bg-brownie hover:bg-caramel text-cream font-bold text-xs transition-colors cursor-pointer text-center text-white"
                    >
                      Search
                    </button>
                    <button 
                      type="button"
                      onClick={handleSellerReset}
                      className="px-4 py-2.5 rounded-xl bg-caramel/10 hover:bg-caramel/20 text-brownie font-bold text-xs transition-colors cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>
                </form>

                {loadingLists ? (
                  <div className="flex justify-center py-12"><Loader2 className="animate-spin text-brownie h-8 w-8" /></div>
                ) : myListingsData.length === 0 ? (
                  <div className="p-8 rounded-2xl border border-dashed border-caramel/30 text-center text-coffee font-semibold">
                    No property listings found. Click 'New Listing' to upload your first house.
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {myListingsData.map((listing, idx) => (
                        <div 
                          key={listing.id} 
                          className={`group bg-cream/40 border border-caramel/20 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg hover:border-caramel/50 transition-all duration-300 flex flex-col justify-between ${
                            idx % 2 === 0 ? 'card-animate-left' : 'card-animate-right'
                          }`}
                          style={{ animationDelay: `${idx * 60}ms` }}
                        >
                          <div className="h-48 bg-coffee/10 relative overflow-hidden">
                            {listing.images && listing.images.length > 0 ? (
                              <img 
                                src={listing.images.find(img => img.isPrimary)?.url || listing.images[0].url} 
                                alt={listing.title} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-coffee font-bold">No Image</div>
                            )}
                            
                            {listing.viewId && (
                              <span className="absolute top-3 left-3 text-[10px] font-extrabold px-3 py-1 rounded-full bg-brownie text-cream border border-caramel/30 select-none shadow-sm">
                                #{listing.viewId}
                              </span>
                            )}
                            
                            <span className="absolute bottom-3 left-3 bg-brownie text-cream text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                              {listing.propertyType.toLowerCase()}
                            </span>
                            
                            {['APPROVED', 'AVAILABLE'].includes(listing.status) && (
                              <span className="absolute top-3 right-3 text-[9px] font-bold px-2.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 uppercase tracking-wider">
                                Approved
                              </span>
                            )}
                            {listing.status === 'PENDING' && (
                              <span className="absolute top-3 right-3 text-[9px] font-bold px-2.5 py-1.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 uppercase tracking-wider">
                                Pending Approval
                              </span>
                            )}
                            {listing.status === 'SOLD' && (
                              <span className="absolute top-3 right-3 text-[9px] font-bold px-2.5 py-1.5 rounded-full bg-slate-700/10 text-slate-700 border border-slate-700/20 uppercase tracking-wider">
                                Sold
                              </span>
                            )}
                            {listing.status === 'ARCHIVED' && (
                              <span className="absolute top-3 right-3 text-[9px] font-bold px-2.5 py-1.5 rounded-full bg-rose-500/10 text-rose-600 border border-rose-500/20 uppercase tracking-wider">
                                Rejected
                              </span>
                            )}
                          </div>

                          <div className="p-5 flex-grow space-y-3">
                            <span className="text-caramel font-bold text-xs flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              {listing.areaLocality?.name}, {listing.city?.name}
                            </span>
                            <h3 className="font-extrabold text-brownie text-base group-hover:text-caramel transition-colors line-clamp-1">
                              {listing.title}
                            </h3>
                            
                            <div className="flex justify-between items-center border-t border-caramel/10 pt-3">
                              <span className="text-base font-extrabold text-brownie">₹{listing.price.toLocaleString('en-IN')}</span>
                              <span className="text-xs text-coffee font-semibold">{listing.area} Sq.Ft.</span>
                            </div>

                            <div className="flex gap-4 text-xs font-semibold text-coffee/80 pt-1">
                              <span className="flex items-center gap-1"><Bed className="h-4 w-4 text-caramel" /> {listing.bedrooms} Bed</span>
                              <span className="flex items-center gap-1"><Bath className="h-4 w-4 text-caramel" /> {listing.bathrooms} Bath</span>
                            </div>
                          </div>

                          <div className="border-t border-caramel/15 p-4 bg-cream/10 flex justify-between items-center gap-2">
                            <button
                              onClick={() => handleDeleteListing(listing.id)}
                              className="p-2.5 rounded-xl border border-rose-500/20 hover:bg-rose-500/10 text-rose-600 transition-colors cursor-pointer"
                              title="Delete Listing"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                            
                            <div className="flex gap-2">
                              {['APPROVED', 'AVAILABLE'].includes(listing.status) && (
                                <button
                                  onClick={() => handleChangeStatus(listing.id, 'SOLD')}
                                  className="flex items-center gap-1 px-4 py-2 rounded-xl bg-brownie hover:bg-caramel text-cream font-bold text-xs transition-colors shadow-sm cursor-pointer"
                                >
                                  <Tag className="h-3.5 w-3.5" />
                                  Mark Sold
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination Controls */}
                    {myListingsPagination.totalPages > 1 && (
                      <div className="flex justify-between items-center border-t border-caramel/15 pt-6 animate-slide-right opacity-0 [animation-fill-mode:forwards]">
                        <button
                          type="button"
                          onClick={() => handleMyListingsPageChange(myListingsPage - 1)}
                          disabled={myListingsPage === 1}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cream border border-caramel/20 hover:bg-caramel/10 text-coffee font-semibold text-xs transition-colors disabled:opacity-50 disabled:hover:bg-cream cursor-pointer"
                        >
                          <ChevronLeft className="h-4 w-4" /> Previous
                        </button>
                        
                        <span className="text-xs text-coffee font-bold">
                          Page {myListingsPage} of {myListingsPagination.totalPages}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleMyListingsPageChange(myListingsPage + 1)}
                          disabled={myListingsPage === myListingsPagination.totalPages}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cream border border-caramel/20 hover:bg-caramel/10 text-coffee font-semibold text-xs transition-colors disabled:opacity-50 disabled:hover:bg-cream cursor-pointer"
                        >
                          Next <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ADD PROPERTY TAB */}
            {activeTab === 'ADD_PROPERTY' && (
              <div className="bg-cream/40 border border-caramel/25 p-8 rounded-3xl shadow-sm space-y-6">
                <h2 className="text-2xl font-extrabold text-brownie">Add New Property</h2>
                
                {formError && <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-800 text-sm font-semibold">{formError}</div>}
                {formSuccess && <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-sm font-semibold">{formSuccess}</div>}
                
                <form onSubmit={handleAddPropertySubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* View ID (disabled) */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-brownie uppercase tracking-wider block">View ID</label>
                      <input 
                        type="text" 
                        disabled
                        value={`#${nextViewId}`}
                        className="w-full px-4 py-3 bg-caramel/5 border border-caramel/20 rounded-2xl text-coffee/60 text-sm font-extrabold cursor-not-allowed select-none"
                      />
                    </div>

                    {/* Listing Title */}
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-bold text-brownie uppercase tracking-wider block">Listing Title</label>
                      <input 
                        type="text" 
                        required 
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        placeholder="e.g. 2BHK House Madurai"
                        className="w-full px-4 py-3 bg-cream/10 border border-caramel/25 rounded-2xl text-brownie placeholder-coffee/40 text-sm font-medium focus:ring-1 focus:ring-caramel focus:outline-none"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-brownie uppercase tracking-wider block">Price (₹)</label>
                        <input 
                          type="number" 
                          required 
                          value={formPrice}
                          onChange={(e) => setFormPrice(e.target.value)}
                          placeholder="6500000"
                          className="w-full px-4 py-3 bg-cream/10 border border-caramel/25 rounded-2xl text-brownie placeholder-coffee/40 text-sm font-medium focus:ring-1 focus:ring-caramel focus:outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-brownie uppercase tracking-wider block">Area (Sq.Ft.)</label>
                        <input 
                          type="number" 
                          required 
                          value={formArea}
                          onChange={(e) => setFormArea(e.target.value)}
                          placeholder="1200"
                          className="w-full px-4 py-3 bg-cream/10 border border-caramel/25 rounded-2xl text-brownie placeholder-coffee/40 text-sm font-medium focus:ring-1 focus:ring-caramel focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-brownie uppercase tracking-wider block">Property Type</label>
                      <select 
                        value={formType}
                        onChange={(e) => setFormType(e.target.value)}
                        className="w-full px-4 py-3 bg-cream/20 border border-caramel/25 rounded-2xl text-brownie text-sm font-medium focus:ring-1 focus:ring-caramel focus:outline-none"
                      >
                        <option value="HOUSE">House</option>
                        <option value="APARTMENT">Apartment</option>
                        <option value="VILLA">Villa</option>
                        <option value="LAND">Land</option>
                        <option value="COMMERCIAL">Commercial</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-brownie uppercase tracking-wider block">Bedrooms</label>
                      <input 
                        type="number" 
                        value={formBedrooms}
                        onChange={(e) => setFormBedrooms(e.target.value)}
                        className="w-full px-4 py-3 bg-cream/10 border border-caramel/25 rounded-2xl text-brownie text-sm font-medium focus:ring-1 focus:ring-caramel focus:outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-brownie uppercase tracking-wider block">Bathrooms</label>
                      <input 
                        type="number" 
                        value={formBathrooms}
                        onChange={(e) => setFormBathrooms(e.target.value)}
                        className="w-full px-4 py-3 bg-cream/10 border border-caramel/25 rounded-2xl text-brownie text-sm font-medium focus:ring-1 focus:ring-caramel focus:outline-none"
                      />
                    </div>

                    <div className="space-y-2 flex flex-col justify-end pb-3">
                      <label className="flex items-center gap-2 text-sm font-bold text-brownie cursor-pointer select-none">
                        <input 
                          type="checkbox"
                          checked={formParking}
                          onChange={(e) => setFormParking(e.target.checked)}
                          className="h-4 w-4 rounded border-caramel/30 accent-caramel"
                        />
                        Has Parking
                      </label>
                    </div>
                  </div>

                  {/* Location Details Dropdown Selectors */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-brownie uppercase tracking-wider block">State</label>
                      <select 
                        required 
                        value={formStateId}
                        onChange={(e) => setFormStateId(e.target.value)}
                        className="w-full px-4 py-3 bg-cream/20 border border-caramel/25 rounded-2xl text-brownie text-sm font-medium focus:ring-1 focus:ring-caramel focus:outline-none"
                      >
                        <option value="">Select State</option>
                        {statesList.map((s) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-brownie uppercase tracking-wider block">City / District</label>
                      <select 
                        required 
                        disabled={!formStateId}
                        value={formCityId}
                        onChange={(e) => setFormCityId(e.target.value)}
                        className="w-full px-4 py-3 bg-cream/20 border border-caramel/25 rounded-2xl text-brownie text-sm font-medium focus:ring-1 focus:ring-caramel focus:outline-none disabled:opacity-50"
                      >
                        <option value="">Select City</option>
                        {citiesList.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-brownie uppercase tracking-wider block">Area / Locality</label>
                      <select 
                        required 
                        disabled={!formCityId}
                        value={formAreaId}
                        onChange={(e) => setFormAreaId(e.target.value)}
                        className="w-full px-4 py-3 bg-cream/20 border border-caramel/25 rounded-2xl text-brownie text-sm font-medium focus:ring-1 focus:ring-caramel focus:outline-none disabled:opacity-50"
                      >
                        <option value="">Select Area</option>
                        {areasList.map((a) => (
                          <option key={a.id} value={a.id}>{a.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brownie uppercase tracking-wider block">Description</label>
                    <textarea 
                      value={formDesc}
                      onChange={(e) => setFormDesc(e.target.value)}
                      placeholder="e.g. Near Bus Stand, 24 Hours Water, School Nearby"
                      rows={3}
                      className="w-full px-4 py-3 bg-cream/10 border border-caramel/25 rounded-2xl text-brownie placeholder-coffee/40 text-sm font-medium focus:ring-1 focus:ring-caramel focus:outline-none"
                    />
                  </div>

                  {/* Amenities */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-brownie uppercase tracking-wider block">Amenities Available</label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {allAmenities.map((amenity) => (
                        <button
                          key={amenity.id}
                          type="button"
                          onClick={() => handleAmenityToggle(amenity.id)}
                          className={`px-4 py-2.5 rounded-xl border text-xs font-bold text-center transition-colors cursor-pointer ${
                            selectedAmenities.includes(amenity.id)
                              ? 'bg-brownie text-cream border-brownie shadow-sm'
                              : 'bg-cream/10 border-caramel/20 text-coffee hover:border-caramel/60'
                          }`}
                        >
                          {amenity.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Image uploads */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-brownie uppercase tracking-wider block">Upload Property Images</label>
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-xs text-coffee file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-brownie file:text-cream file:cursor-pointer hover:file:bg-caramel"
                    />
                    {uploadedImages.length > 0 && (
                      <div className="grid grid-cols-4 gap-4 pt-3">
                        {uploadedImages.map((base64, idx) => (
                          <div key={idx} className="h-20 border border-caramel/20 rounded-xl overflow-hidden relative shadow-sm">
                            <img src={base64} className="w-full h-full object-cover" alt="preview" />
                            <button
                              type="button"
                              onClick={() => setUploadedImages((prev) => prev.filter((_, i) => i !== idx))}
                              className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-sm cursor-pointer flex items-center justify-center"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={formLoading}
                    className="w-full py-4 bg-brownie hover:bg-caramel text-cream font-bold rounded-2xl shadow-md shadow-brownie/10 transition-colors flex items-center justify-center disabled:opacity-75 cursor-pointer text-white"
                  >
                    {formLoading ? (
                      <>
                        <Loader2 className="animate-spin h-5 w-5 mr-2" />
                        Submitting listing...
                      </>
                    ) : (
                      'Submit Property'
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* LEADS TAB */}
            {activeTab === 'LEADS' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-extrabold text-brownie">Leads / Customer Inquiries</h2>
                
                {myLeadsData.length === 0 ? (
                  <div className="p-8 rounded-2xl border border-dashed border-caramel/30 text-center text-coffee font-semibold">
                    You have not received any customer enquiries yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myLeadsData.map((lead) => (
                      <div key={lead.id} className="bg-cream/40 border border-caramel/20 p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between gap-4">
                        <div className="space-y-2">
                          <h4 className="font-extrabold text-brownie text-base flex flex-wrap items-center gap-2">
                            {lead.property.title}
                            {lead.property.viewId && (
                              <span className="px-2.5 py-0.5 rounded bg-brownie text-cream font-extrabold text-[10px] select-none shadow-sm">
                                #{lead.property.viewId}
                              </span>
                            )}
                            {lead.property.status === 'SOLD' ? (
                              <span className="text-[9px] font-bold px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 uppercase tracking-wider select-none">
                                Completed
                              </span>
                            ) : (
                              <span className="text-[9px] font-bold px-2.5 py-1 rounded bg-amber-500/10 text-amber-600 border border-amber-500/20 uppercase tracking-wider select-none">
                                Active
                              </span>
                            )}
                          </h4>
                          <p className="text-xs text-coffee font-medium flex flex-wrap items-center gap-x-2 gap-y-1">
                            Customer: <span className="text-brownie font-bold">{lead.customer.fullName}</span> 
                            <span className="text-coffee/60">({lead.customer.email})</span>
                            {lead.customer.mobile && (
                              <span className="px-2 py-0.5 rounded-md bg-caramel/15 text-caramel font-bold text-[10px]">
                                Phone: {lead.customer.mobile}
                              </span>
                            )}
                          </p>
                          <blockquote className="text-sm bg-cream/10 border-l-2 border-caramel p-3 text-coffee/90 font-medium italic rounded-r-xl">
                            "{lead.message}"
                          </blockquote>
                        </div>
                        <div className="text-right flex sm:flex-col justify-between sm:justify-start items-center sm:items-end gap-2 shrink-0">
                          <span className="text-[10px] text-coffee/60 font-semibold">{new Date(lead.createdAt).toLocaleDateString()}</span>
                          <div className="flex gap-2">
                            {lead.customer.mobile && (
                              <a 
                                href={`tel:${lead.customer.mobile.replace(/\s+/g, '')}`}
                                className="px-4 py-2 rounded-xl border border-caramel text-caramel hover:bg-caramel/10 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                              >
                                <Phone className="h-3.5 w-3.5" />
                                Call
                              </a>
                            )}
                            <button 
                              type="button"
                              onClick={() => handleReplyMail(lead.customer.email, lead.property.title)}
                              className="px-4 py-2 rounded-xl bg-brownie hover:bg-caramel text-cream font-bold text-xs transition-colors cursor-pointer text-white"
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </main>
        </div>

        {copiedText && (
          <div className="fixed bottom-5 right-5 z-50 bg-brownie text-cream px-5 py-3.5 rounded-2xl shadow-lg border border-caramel/30 text-xs font-bold flex items-center gap-2 animate-slide-right opacity-0 [animation-fill-mode:forwards]">
            <XCircle className="h-4 w-4 text-emerald-400" />
            <span>Copied: {copiedText} & launching mail client...</span>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
