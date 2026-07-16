'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import AuthGuard from '../../../components/AuthGuard';
import { apiRequest } from '../../../utils/api';
import DashboardNavbar from '../../../components/DashboardNavbar';
import { useRouter } from 'next/navigation';
import { 
  Loader2, MapPin, Bed, Bath, Mail, Phone, ChevronLeft, ChevronRight, CheckCircle, XCircle, Search
} from 'lucide-react';


export default function BuyerDashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('OVERVIEW'); // OVERVIEW, BROWSE, INQUIRIES
  const [copiedText, setCopiedText] = useState('');
  
  // Buyer States
  const [browseProperties, setBrowseProperties] = useState([]);
  const [browseLoading, setBrowseLoading] = useState(false);
  const [myEnquiries, setMyEnquiries] = useState([]);
  const [loadingEnquiries, setLoadingEnquiries] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  
  // Buyer Search State
  const [searchStateId, setSearchStateId] = useState('');
  const [searchCityId, setSearchCityId] = useState('');
  const [searchAreaId, setSearchAreaId] = useState('');
  const [searchType, setSearchType] = useState('');
  const [searchMinPrice, setSearchMinPrice] = useState('');
  const [searchMaxPrice, setSearchMaxPrice] = useState('');
  const [searchCitiesList, setSearchCitiesList] = useState([]);
  const [searchAreasList, setSearchAreasList] = useState([]);
  
  // Buyer Pagination State
  const [browsePage, setBrowsePage] = useState(1);
  const [browsePagination, setBrowsePagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });

  // Drawer enquiry form state
  const [drawerEnquiryMsg, setDrawerEnquiryMsg] = useState('I am interested in this property. Please contact me with more details.');
  const [drawerEnquiryLoading, setDrawerEnquiryLoading] = useState(false);
  const [drawerEnquirySuccess, setDrawerEnquirySuccess] = useState('');
  const [drawerEnquiryError, setDrawerEnquiryError] = useState('');
  
  const [statesList, setStatesList] = useState([]);
  const [allAmenities, setAllAmenities] = useState([]);

  // Role Guard Redirect
  useEffect(() => {
    if (user && user.role !== 'BUYER') {
      router.replace('/dashboard');
    }
  }, [user, router]);

  useEffect(() => {
    fetchAmenities();
    fetchStates();
    
    if (user?.role === 'BUYER') {
      fetchMyEnquiries();
      fetchBrowseProperties(1);
    }
  }, [user, activeTab]);

  // Load cities cascading when search state changes
  useEffect(() => {
    if (searchStateId) {
      fetchSearchCities(searchStateId);
      setSearchCitiesList([]);
      setSearchAreasList([]);
      setSearchCityId('');
      setSearchAreaId('');
    } else {
      setSearchCitiesList([]);
      setSearchAreasList([]);
      setSearchCityId('');
      setSearchAreaId('');
    }
  }, [searchStateId]);

  // Load areas cascading when search city changes
  useEffect(() => {
    if (searchCityId) {
      fetchSearchAreas(searchCityId);
      setSearchAreasList([]);
      setSearchAreaId('');
    } else {
      setSearchAreasList([]);
      setSearchAreaId('');
    }
  }, [searchCityId]);

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

  // Search cascades
  const fetchSearchCities = async (sId) => {
    try {
      const res = await apiRequest(`/locations/states/${sId}/cities`);
      if (res.ok) {
        const data = await res.json();
        setSearchCitiesList(data.data.cities);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSearchAreas = async (cId) => {
    try {
      const res = await apiRequest(`/locations/cities/${cId}/areas`);
      if (res.ok) {
        const data = await res.json();
        setSearchAreasList(data.data.areas);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Buyer Specific APIs
  const fetchBrowseProperties = async (pageVal = browsePage) => {
    setBrowseLoading(true);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', pageVal);
      queryParams.append('limit', 10);
      
      if (searchStateId) queryParams.append('stateId', searchStateId);
      if (searchCityId) queryParams.append('cityId', searchCityId);
      if (searchAreaId) queryParams.append('areaId', searchAreaId);
      if (searchType) queryParams.append('propertyType', searchType);
      if (searchMinPrice) queryParams.append('minPrice', searchMinPrice);
      if (searchMaxPrice) queryParams.append('maxPrice', searchMaxPrice);

      const res = await apiRequest(`/properties?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setBrowseProperties(data.data.properties);
        if (data.pagination) {
          setBrowsePagination(data.pagination);
        }
      }
    } catch (err) {
      console.error('Error browsing properties:', err);
    } finally {
      setBrowseLoading(false);
    }
  };

  const fetchMyEnquiries = async () => {
    setLoadingEnquiries(true);
    try {
      const res = await apiRequest('/enquiries/my-enquiries');
      if (res.ok) {
        const data = await res.json();
        setMyEnquiries(data.data.enquiries);
      }
    } catch (err) {
      console.error('Error fetching sent enquiries:', err);
    } finally {
      setLoadingEnquiries(false);
    }
  };

  // Submit enquiry from inside details drawer
  const handleDrawerEnquirySubmit = async (e) => {
    e.preventDefault();
    setDrawerEnquiryError('');
    setDrawerEnquirySuccess('');
    setDrawerEnquiryLoading(true);

    try {
      const res = await apiRequest('/enquiries', {
        method: 'POST',
        body: JSON.stringify({
          propertyId: selectedProperty.id,
          message: drawerEnquiryMsg,
        }),
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.message || 'Failed to submit enquiry.');
      }

      setDrawerEnquirySuccess(resData.message || 'Enquiry sent! The owner has been notified.');
      setDrawerEnquiryMsg('I am interested in this property. Please contact me with more details.');
      fetchMyEnquiries(); // Refresh buyer enquiries list
    } catch (err) {
      setDrawerEnquiryError(err.message);
    } finally {
      setDrawerEnquiryLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setBrowsePage(1);
    fetchBrowseProperties(1);
  };

  const handleClearFilters = () => {
    setSearchStateId('');
    setSearchCityId('');
    setSearchAreaId('');
    setSearchType('');
    setSearchMinPrice('');
    setSearchMaxPrice('');
    setBrowsePage(1);
    
    // Clear list options
    setSearchCitiesList([]);
    setSearchAreasList([]);

    // Call API with empty parameters
    setTimeout(() => {
      fetchBrowseProperties(1);
    }, 50);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > browsePagination.totalPages) return;
    setBrowsePage(newPage);
    fetchBrowseProperties(newPage);
  };

  const handleContactOwner = (email, title) => {
    // Copy to clipboard
    navigator.clipboard.writeText(email).then(() => {
      setCopiedText(email);
      setTimeout(() => setCopiedText(''), 3000);
    }).catch(err => console.error('Could not copy email:', err));
    
    window.location.href = `mailto:${email}?subject=Regarding my inquiry on your property: ${encodeURIComponent(title)}`;
  };

  const handleCardClick = (property) => {
    setDrawerEnquirySuccess('');
    setDrawerEnquiryError('');
    setSelectedProperty(property);
  };

  if (!user || user.role !== 'BUYER') {
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
          role="BUYER"
          enquiriesCount={myEnquiries.length}
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
                    <span className="block text-xs font-bold text-coffee uppercase tracking-wider mb-2">Inquiries Submitted</span>
                    <span className="text-2xl font-extrabold text-brownie">{myEnquiries.length}</span>
                  </div>
                  <div className="bg-cream/40 border border-caramel/25 p-6 rounded-2xl shadow-sm">
                    <span className="block text-xs font-bold text-coffee uppercase tracking-wider mb-2">Available Properties</span>
                    <span className="text-2xl font-extrabold text-brownie">{browsePagination.total}</span>
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

            {/* BROWSE PROPERTIES TAB */}
            {activeTab === 'BROWSE' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-extrabold text-brownie">Explore Premium Properties</h2>
                    <p className="text-xs text-coffee font-medium mt-1">Search through verified listings with database-backed speeds.</p>
                  </div>
                  <span className="text-xs bg-brownie/10 border border-caramel/20 text-brownie font-bold px-3 py-1.5 rounded-full">
                    {browsePagination.total.toLocaleString()} Properties Found
                  </span>
                </div>

                {/* Cascading Location & Budget Filters */}
                <section className="bg-cream/40 border border-caramel/25 p-6 rounded-3xl shadow-sm">
                  <form onSubmit={handleSearchSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-coffee uppercase tracking-wider">State</label>
                        <select
                          value={searchStateId}
                          onChange={(e) => setSearchStateId(e.target.value)}
                          className="w-full px-4 py-3 bg-cream/10 border border-caramel/25 rounded-2xl text-brownie text-sm font-semibold focus:outline-none"
                        >
                          <option value="">All States</option>
                          {statesList.map((s) => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-coffee uppercase tracking-wider">City</label>
                        <select
                          disabled={!searchStateId}
                          value={searchCityId}
                          onChange={(e) => setSearchCityId(e.target.value)}
                          className="w-full px-4 py-3 bg-cream/10 border border-caramel/25 rounded-2xl text-brownie text-sm font-semibold focus:outline-none disabled:opacity-50"
                        >
                          <option value="">All Cities</option>
                          {searchCitiesList.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-coffee uppercase tracking-wider">Area / Locality</label>
                        <select
                          disabled={!searchCityId}
                          value={searchAreaId}
                          onChange={(e) => setSearchAreaId(e.target.value)}
                          className="w-full px-4 py-3 bg-cream/10 border border-caramel/25 rounded-2xl text-brownie text-sm font-semibold focus:outline-none disabled:opacity-50"
                        >
                          <option value="">All Areas</option>
                          {searchAreasList.map((a) => (
                            <option key={a.id} value={a.id}>{a.name}</option>
                          ))}
                        </select>
                      </div>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-coffee uppercase tracking-wider">Property Type</label>
                        <select
                          value={searchType}
                          onChange={(e) => setSearchType(e.target.value)}
                          className="w-full px-4 py-3 bg-cream/10 border border-caramel/25 rounded-2xl text-brownie text-sm font-semibold focus:outline-none"
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
                        <label className="text-[10px] font-bold text-coffee uppercase tracking-wider">Min Budget (₹)</label>
                        <input
                          type="number"
                          value={searchMinPrice}
                          onChange={(e) => setSearchMinPrice(e.target.value)}
                          placeholder="e.g. 500000"
                          className="w-full px-4 py-2.5 bg-cream/10 border border-caramel/25 rounded-2xl text-brownie placeholder-coffee/40 text-sm font-semibold focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-coffee uppercase tracking-wider">Max Budget (₹)</label>
                        <input
                          type="number"
                          value={searchMaxPrice}
                          onChange={(e) => setSearchMaxPrice(e.target.value)}
                          placeholder="e.g. 20000000"
                          className="w-full px-4 py-2.5 bg-cream/10 border border-caramel/25 rounded-2xl text-brownie placeholder-coffee/40 text-sm font-semibold focus:outline-none"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="flex-grow py-3 bg-brownie hover:bg-caramel text-cream font-bold rounded-2xl shadow-sm text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Search className="h-4 w-4" /> Search
                        </button>
                        <button
                          type="button"
                          onClick={handleClearFilters}
                          className="px-4 py-3 bg-cream border border-caramel/20 hover:bg-caramel/10 text-coffee font-bold rounded-2xl text-sm transition-colors cursor-pointer"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  </form>
                </section>

                {/* Listings Grid */}
                {browseLoading ? (
                  <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brownie h-10 w-10" /></div>
                ) : browseProperties.length === 0 ? (
                  <div className="p-16 border border-dashed border-caramel/20 rounded-3xl text-center text-coffee font-semibold">
                    No matching properties found. Try updating your filters or location search criteria.
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {browseProperties.map((property, idx) => (
                        <div 
                          key={property.id} 
                          onClick={() => handleCardClick(property)}
                          className={`group cursor-pointer bg-cream/40 border border-caramel/20 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg hover:border-caramel/50 transition-all duration-300 flex flex-col justify-between opacity-0 ${
                            idx % 2 === 0 ? 'animate-slide-left' : 'animate-slide-right'
                          } [animation-fill-mode:forwards]`}
                          style={{ animationDelay: `${idx * 50}ms` }}
                        >
                          <div className="h-44 bg-coffee/10 relative overflow-hidden">
                            {property.images && property.images.length > 0 ? (
                              <img 
                                src={property.images[0].url} 
                                alt={property.title} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-coffee font-bold">No Image</div>
                            )}
                            <span className="absolute bottom-3 left-3 bg-brownie text-cream text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                              {property.propertyType.toLowerCase()}
                            </span>
                            <span className="absolute top-3 right-3 bg-emerald-500 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase">
                              Approved
                            </span>
                          </div>

                          <div className="p-5 flex-grow space-y-3">
                            <span className="text-caramel font-bold text-xs flex items-center gap-1">
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
                        </div>
                      ))}
                    </div>

                    {/* Pagination Controls */}
                    {browsePagination.totalPages > 1 && (
                      <div className="flex justify-between items-center border-t border-caramel/15 pt-6">
                        <button
                          onClick={() => handlePageChange(browsePage - 1)}
                          disabled={browsePage === 1}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cream border border-caramel/20 hover:bg-caramel/10 text-coffee font-semibold text-xs transition-colors disabled:opacity-50 disabled:hover:bg-cream cursor-pointer"
                        >
                          <ChevronLeft className="h-4 w-4" /> Previous
                        </button>
                        
                        <span className="text-xs text-coffee font-bold">
                          Page {browsePage} of {browsePagination.totalPages}
                        </span>

                        <button
                          onClick={() => handlePageChange(browsePage + 1)}
                          disabled={browsePage === browsePagination.totalPages}
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

            {/* MY INQUIRIES TAB */}
            {activeTab === 'INQUIRIES' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-extrabold text-brownie">My Sent Inquiries / Messages</h2>
                
                {loadingEnquiries ? (
                  <div className="flex justify-center py-12"><Loader2 className="animate-spin text-brownie h-8 w-8" /></div>
                ) : myEnquiries.length === 0 ? (
                  <div className="p-8 rounded-2xl border border-dashed border-caramel/30 text-center text-coffee font-semibold">
                    You have not submitted any property inquiries yet. Browse properties to send messages.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myEnquiries.map((lead, idx) => (
                      <div 
                        key={lead.id} 
                        className={`bg-cream/40 border border-caramel/20 p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between gap-4 opacity-0 ${
                          idx % 2 === 0 ? 'animate-slide-left' : 'animate-slide-right'
                        } [animation-fill-mode:forwards]`}
                        style={{ animationDelay: `${idx * 50}ms` }}
                      >
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-2 items-center">
                            <span className="text-[10px] bg-caramel/15 border border-caramel/20 text-coffee font-extrabold px-2.5 py-1 rounded-full uppercase">
                              {lead.property.propertyType.toLowerCase()}
                            </span>
                            {lead.property.status === 'SOLD' ? (
                              <span className="text-[9px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 uppercase tracking-wider select-none">
                                Completed
                              </span>
                            ) : (
                              <span className="text-[9px] font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 uppercase tracking-wider select-none">
                                Active
                              </span>
                            )}
                          </div>
                          <h4 className="font-extrabold text-brownie text-base mt-1">{lead.property.title}</h4>
                          <p className="text-xs text-coffee font-medium flex flex-wrap items-center gap-x-2 gap-y-1">
                            Owner: <span className="text-brownie font-bold">{lead.property.owner.fullName}</span> 
                            <span className="text-coffee/60">({lead.property.owner.email})</span>
                            {lead.property.owner.mobile && (
                              <span className="px-2 py-0.5 rounded-md bg-caramel/15 text-caramel font-bold text-[10px]">
                                Phone: {lead.property.owner.mobile}
                              </span>
                            )}
                          </p>
                          <blockquote className="text-sm bg-cream/10 border-l-2 border-caramel p-3 text-coffee/90 font-medium italic rounded-r-xl">
                            "{lead.message}"
                          </blockquote>
                        </div>
                        <div className="text-right flex sm:flex-col justify-between sm:justify-start items-center sm:items-end gap-2 shrink-0">
                          <span className="text-[10px] text-coffee/60 font-semibold">{new Date(lead.createdAt).toLocaleDateString()}</span>
                          <span className="text-xs font-bold text-brownie block">₹{lead.property.price.toLocaleString('en-IN')}</span>
                          <div className="flex sm:flex-col gap-2 w-full">
                            {lead.property.owner.mobile && (
                              <a 
                                href={`tel:${lead.property.owner.mobile.replace(/\s+/g, '')}`}
                                className="px-4 py-2 rounded-xl border border-caramel text-caramel hover:bg-caramel/10 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <Phone className="h-3.5 w-3.5" />
                                Call Owner
                              </a>
                            )}
                            <button 
                              type="button"
                              onClick={() => handleContactOwner(lead.property.owner.email, lead.property.title)}
                              className="px-4 py-2 rounded-xl bg-brownie hover:bg-caramel text-cream font-bold text-xs transition-colors block text-center cursor-pointer"
                            >
                              Email
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

        {/* Sliding Details Drawer */}
        {selectedProperty && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div 
              className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
              onClick={() => setSelectedProperty(null)}
            />
            
            <div className="relative w-full max-w-2xl bg-cream h-full shadow-2xl p-6 overflow-y-auto z-10 animate-slide-right opacity-0 [animation-fill-mode:forwards] border-l border-caramel/30 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center pb-4 border-b border-caramel/20 mb-6">
                  <h3 className="font-extrabold text-brownie text-lg">Property Details</h3>
                  <button 
                    onClick={() => setSelectedProperty(null)}
                    className="px-4 py-2 rounded-xl bg-caramel/10 text-brownie hover:bg-caramel/20 font-extrabold text-sm cursor-pointer"
                  >
                    Close
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="h-72 bg-coffee/10 rounded-3xl overflow-hidden shadow-inner">
                    {selectedProperty.images && selectedProperty.images.length > 0 ? (
                      <img src={selectedProperty.images[0].url} className="w-full h-full object-cover animate-slide-left opacity-0 [animation-fill-mode:forwards]" alt={selectedProperty.title} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-coffee">No Image</div>
                    )}
                  </div>
                  
                  <div className="space-y-2 animate-slide-right opacity-0 [animation-fill-mode:forwards]">
                    <span className="text-caramel font-bold text-xs uppercase flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {selectedProperty.areaLocality?.name}, {selectedProperty.city?.name}, {selectedProperty.state?.name}
                    </span>
                    <h4 className="font-extrabold text-brownie text-xl leading-tight">{selectedProperty.title}</h4>
                    <p className="text-2xl font-extrabold text-brownie">₹{selectedProperty.price.toLocaleString('en-IN')}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 border-y border-caramel/15 py-4 animate-slide-left opacity-0 [animation-fill-mode:forwards]">
                    <div>
                      <span className="block text-[9px] font-bold text-coffee uppercase">Area</span>
                      <span className="text-sm font-bold text-brownie">{selectedProperty.area} Sq.Ft.</span>
                    </div>
                    <div>
                      <span className="block text-[9px] font-bold text-coffee uppercase">Bedrooms</span>
                      <span className="text-sm font-bold text-brownie">{selectedProperty.bedrooms} BHK</span>
                    </div>
                    <div>
                      <span className="block text-[9px] font-bold text-coffee uppercase">Bathrooms</span>
                      <span className="text-sm font-bold text-brownie">{selectedProperty.bathrooms} Baths</span>
                    </div>
                  </div>

                  <div className="space-y-2 animate-slide-right opacity-0 [animation-fill-mode:forwards]">
                    <h5 className="font-bold text-brownie text-sm">Description</h5>
                    <p className="text-xs text-coffee leading-relaxed whitespace-pre-line font-medium">{selectedProperty.description}</p>
                  </div>

                  {/* Quick Contact Form */}
                  <div className="bg-cream border border-caramel/25 p-5 rounded-2xl space-y-4 shadow-sm animate-slide-left opacity-0 [animation-fill-mode:forwards]">
                    <h5 className="font-bold text-brownie text-sm flex items-center gap-2"><Mail className="h-4 w-4 text-caramel" /> Submit Inquiry</h5>
                    {drawerEnquirySuccess ? (
                      <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs font-semibold rounded-xl">{drawerEnquirySuccess}</div>
                    ) : (
                      <form onSubmit={handleDrawerEnquirySubmit} className="space-y-3">
                        {drawerEnquiryError && <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-800 text-xs font-semibold rounded-xl">{drawerEnquiryError}</div>}
                        <textarea
                          value={drawerEnquiryMsg}
                          onChange={(e) => setDrawerEnquiryMsg(e.target.value)}
                          rows={3}
                          required
                          placeholder="I am interested in this listing. Please contact me."
                          className="w-full p-3.5 bg-cream border border-caramel/20 rounded-xl text-xs text-brownie focus:outline-none focus:ring-1 focus:ring-caramel"
                        />
                        <button
                          type="submit"
                          disabled={drawerEnquiryLoading}
                          className="w-full py-3 bg-brownie hover:bg-caramel text-cream font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          {drawerEnquiryLoading ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : 'Send Inquiry Message'}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {copiedText && (
          <div className="fixed bottom-5 right-5 z-50 bg-brownie text-cream px-5 py-3.5 rounded-2xl shadow-lg border border-caramel/30 text-xs font-bold flex items-center gap-2 animate-slide-right opacity-0 [animation-fill-mode:forwards]">
            <CheckCircle className="h-4 w-4 text-emerald-400" />
            <span>Copied: {copiedText} & launching mail client...</span>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
