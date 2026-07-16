'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import AuthGuard from '../../../components/AuthGuard';
import { apiRequest } from '../../../utils/api';
import DashboardNavbar from '../../../components/DashboardNavbar';
import { useRouter } from 'next/navigation';
import { 
  PlusCircle, Loader2, MapPin, Bed, Bath, Trash2, Tag, ChevronLeft, ChevronRight, XCircle, CheckCircle, Phone,
  UserMinus, Edit2, Filter, Plus, Globe, Search, Mail
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('OVERVIEW'); // OVERVIEW, MY_LISTINGS, ADD_PROPERTY, LEADS, MODERATION
  const [copiedText, setCopiedText] = useState('');
  
  // Listings and Leads States (Seller/Admin)
  const [myListingsData, setMyListingsData] = useState([]);
  const [pendingListings, setPendingListings] = useState([]);
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
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Add Property Form States (Seller/Admin)
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

  // UserMaster States
  const [usersList, setUsersList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [userCurrentPage, setUserCurrentPage] = useState(1);
  const [userTotalPages, setUserTotalPages] = useState(1);
  const [userTotal, setUserTotal] = useState(0);
  const [editingUser, setEditingUser] = useState(null);
  
  const [editFormFullName, setEditFormFullName] = useState('');
  const [editFormEmail, setEditFormEmail] = useState('');
  const [editFormMobile, setEditFormMobile] = useState('');
  const [editFormRole, setEditFormRole] = useState('BUYER');
  const [editFormError, setEditFormError] = useState('');
  const [editFormLoading, setEditFormLoading] = useState(false);

  // LocationMaster States
  const [allCitiesList, setAllCitiesList] = useState([]);
  const [allAreasList, setAllAreasList] = useState([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [locationSubTab, setLocationSubTab] = useState('STATES'); // STATES, CITIES, AREAS
  
  const [newStateName, setNewStateName] = useState('');
  const [stateSearch, setStateSearch] = useState('');
  const [stateFormLoading, setStateFormLoading] = useState(false);
  const [stateFormError, setStateFormError] = useState('');
  const [stateCurrentPage, setStateCurrentPage] = useState(1);
  const [stateTotalPages, setStateTotalPages] = useState(1);
  const [stateTotal, setStateTotal] = useState(0);

  const [newCityName, setNewCityName] = useState('');
  const [newCityStateId, setNewCityStateId] = useState('');
  const [citySearch, setCitySearch] = useState('');
  const [cityFormLoading, setCityFormLoading] = useState(false);
  const [cityFormError, setCityFormError] = useState('');
  const [cityCurrentPage, setCityCurrentPage] = useState(1);
  const [cityTotalPages, setCityTotalPages] = useState(1);
  const [cityTotal, setCityTotal] = useState(0);

  const [newAreaName, setNewAreaName] = useState('');
  const [newAreaStateId, setNewAreaStateId] = useState('');
  const [newAreaCityId, setNewAreaCityId] = useState('');
  const [newAreaCities, setNewAreaCities] = useState([]);
  const [areaSearch, setAreaSearch] = useState('');
  const [areaFormLoading, setAreaFormLoading] = useState(false);
  const [areaFormError, setAreaFormError] = useState('');
  const [areaCurrentPage, setAreaCurrentPage] = useState(1);
  const [areaTotalPages, setAreaTotalPages] = useState(1);
  const [areaTotal, setAreaTotal] = useState(0);

  const PAGE_LIMIT = 10;

  // Fetch Users (server-side paginated)
  const fetchUsers = async (page = userCurrentPage, search = userSearch, role = userRoleFilter) => {
    setLoadingUsers(true);
    try {
      const params = new URLSearchParams({ page, limit: PAGE_LIMIT });
      if (search) params.append('search', search);
      if (role) params.append('role', role);
      const res = await apiRequest(`/admin/users?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setUsersList(data.data.users);
        setUserTotalPages(data.pagination.totalPages);
        setUserTotal(data.pagination.total);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Fetch States (server-side paginated)
  const fetchStatesPage = async (page = stateCurrentPage, search = stateSearch) => {
    setLoadingStates(true);
    try {
      const params = new URLSearchParams({ page, limit: PAGE_LIMIT });
      if (search) params.append('search', search);
      const res = await apiRequest(`/admin/locations/states?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setStatesList(data.data.states);
        setStateTotalPages(data.pagination.totalPages);
        setStateTotal(data.pagination.total);
      }
    } catch (err) {
      console.error('Error fetching states:', err);
    } finally {
      setLoadingStates(false);
    }
  };

  // Fetch Cities (server-side paginated)
  const fetchCitiesPage = async (page = cityCurrentPage, search = citySearch) => {
    setLoadingCities(true);
    try {
      const params = new URLSearchParams({ page, limit: PAGE_LIMIT });
      if (search) params.append('search', search);
      const res = await apiRequest(`/admin/locations/cities?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setAllCitiesList(data.data.cities);
        setCityTotalPages(data.pagination.totalPages);
        setCityTotal(data.pagination.total);
      }
    } catch (err) {
      console.error('Error fetching cities:', err);
    } finally {
      setLoadingCities(false);
    }
  };

  // Fetch Areas (server-side paginated)
  const fetchAreasPage = async (page = areaCurrentPage, search = areaSearch) => {
    setLoadingAreas(true);
    try {
      const params = new URLSearchParams({ page, limit: PAGE_LIMIT });
      if (search) params.append('search', search);
      const res = await apiRequest(`/admin/locations/areas?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setAllAreasList(data.data.areas);
        setAreaTotalPages(data.pagination.totalPages);
        setAreaTotal(data.pagination.total);
      }
    } catch (err) {
      console.error('Error fetching areas:', err);
    } finally {
      setLoadingAreas(false);
    }
  };

  // Fetch all states (unpaginated) for form dropdowns
  const fetchAllStatesForDropdown = async () => {
    try {
      const res = await apiRequest('/admin/locations/states?page=1&limit=1000');
      if (res.ok) {
        const data = await res.json();
        // Store in a separate ref used by forms — reuse statesList only for the table,
        // but the dropdown needs all states. We overload statesList when not on STATES subtab.
        return data.data.states;
      }
    } catch (err) {
      console.error(err);
    }
    return [];
  };

  // Handle Edit User Form Autofill
  useEffect(() => {
    if (editingUser) {
      setEditFormFullName(editingUser.fullName || '');
      setEditFormEmail(editingUser.email || '');
      setEditFormMobile(editingUser.mobile || '');
      setEditFormRole(editingUser.role || 'BUYER');
      setEditFormError('');
    }
  }, [editingUser]);

  // Handle Cascading dropdown for Area Form City selection
  useEffect(() => {
    if (newAreaStateId) {
      const fetchCitiesForAreaForm = async () => {
        try {
          const res = await apiRequest(`/locations/states/${newAreaStateId}/cities`);
          if (res.ok) {
            const data = await res.json();
            setNewAreaCities(data.data.cities);
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchCitiesForAreaForm();
    } else {
      setNewAreaCities([]);
      setNewAreaCityId('');
    }
  }, [newAreaStateId]);

  // Trigger master tab data loading
  useEffect(() => {
    if (user?.role === 'ADMIN') {
      if (activeTab === 'USER_MASTER') {
        fetchUsers(1, userSearch, userRoleFilter);
        setUserCurrentPage(1);
      } else if (activeTab === 'LOCATION_MASTER') {
        fetchStatesPage(1, '');
        setStateCurrentPage(1);
        // Also preload all states for dropdowns
        fetchAllStatesForDropdown().then(all => {
          if (locationSubTab !== 'STATES') setStatesList(all);
        });
      }
    }
  }, [user, activeTab]);

  // Re-fetch when subtab changes
  useEffect(() => {
    if (user?.role === 'ADMIN' && activeTab === 'LOCATION_MASTER') {
      if (locationSubTab === 'STATES') {
        fetchStatesPage(1, stateSearch);
        setStateCurrentPage(1);
      } else if (locationSubTab === 'CITIES') {
        fetchCitiesPage(1, citySearch);
        setCityCurrentPage(1);
        // Preload states for the city form dropdown
        fetchAllStatesForDropdown().then(all => setStatesList(all));
      } else if (locationSubTab === 'AREAS') {
        fetchAreasPage(1, areaSearch);
        setAreaCurrentPage(1);
        // Preload states for the area form dropdown
        fetchAllStatesForDropdown().then(all => setStatesList(all));
      }
    }
  }, [locationSubTab]);

  // Re-fetch users when page/search/role changes
  useEffect(() => {
    if (user?.role === 'ADMIN' && activeTab === 'USER_MASTER') {
      fetchUsers(userCurrentPage, userSearch, userRoleFilter);
    }
  }, [userCurrentPage, userSearch, userRoleFilter]);

  // Re-fetch states when page/search changes
  useEffect(() => {
    if (user?.role === 'ADMIN' && activeTab === 'LOCATION_MASTER' && locationSubTab === 'STATES') {
      fetchStatesPage(stateCurrentPage, stateSearch);
    }
  }, [stateCurrentPage, stateSearch]);

  // Re-fetch cities when page/search changes
  useEffect(() => {
    if (user?.role === 'ADMIN' && activeTab === 'LOCATION_MASTER' && locationSubTab === 'CITIES') {
      fetchCitiesPage(cityCurrentPage, citySearch);
    }
  }, [cityCurrentPage, citySearch]);

  // Re-fetch areas when page/search changes
  useEffect(() => {
    if (user?.role === 'ADMIN' && activeTab === 'LOCATION_MASTER' && locationSubTab === 'AREAS') {
      fetchAreasPage(areaCurrentPage, areaSearch);
    }
  }, [areaCurrentPage, areaSearch]);

  // CRUD handlers
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setEditFormError('');
    setEditFormLoading(true);
    try {
      const res = await apiRequest(`/admin/users/${editingUser.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          fullName: editFormFullName,
          email: editFormEmail,
          mobile: editFormMobile,
          role: editFormRole,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update user.');
      }
      setEditingUser(null);
      fetchUsers(userCurrentPage, userSearch, userRoleFilter);
    } catch (err) {
      setEditFormError(err.message);
    } finally {
      setEditFormLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user permanently? This will also delete all their properties and enquiries.')) return;
    try {
      const res = await apiRequest(`/admin/users/${userId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchUsers(userCurrentPage, userSearch, userRoleFilter);
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to delete user.');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const handleAddState = async (e) => {
    e.preventDefault();
    setStateFormError('');
    setStateFormLoading(true);
    try {
      const res = await apiRequest('/admin/locations/states', {
        method: 'POST',
        body: JSON.stringify({ name: newStateName }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to add state.');
      }
      setNewStateName('');
      fetchStatesPage(stateCurrentPage, stateSearch);
    } catch (err) {
      setStateFormError(err.message);
    } finally {
      setStateFormLoading(false);
    }
  };

  const handleDeleteState = async (stateId) => {
    if (!window.confirm('Are you sure you want to delete this State? Ensure no properties, cities, or areas are linked to it.')) return;
    try {
      const res = await apiRequest(`/admin/locations/states/${stateId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchStatesPage(stateCurrentPage, stateSearch);
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to delete state.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCity = async (e) => {
    e.preventDefault();
    setCityFormError('');
    setCityFormLoading(true);
    try {
      const res = await apiRequest('/admin/locations/cities', {
        method: 'POST',
        body: JSON.stringify({ name: newCityName, stateId: newCityStateId }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to add city.');
      }
      setNewCityName('');
      setNewCityStateId('');
      fetchCitiesPage(cityCurrentPage, citySearch);
    } catch (err) {
      setCityFormError(err.message);
    } finally {
      setCityFormLoading(false);
    }
  };

  const handleDeleteCity = async (cityId) => {
    if (!window.confirm('Are you sure you want to delete this City? Ensure no areas or properties are linked to it.')) return;
    try {
      const res = await apiRequest(`/admin/locations/cities/${cityId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchCitiesPage(cityCurrentPage, citySearch);
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to delete city.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddArea = async (e) => {
    e.preventDefault();
    setAreaFormError('');
    setAreaFormLoading(true);
    try {
      const res = await apiRequest('/admin/locations/areas', {
        method: 'POST',
        body: JSON.stringify({ name: newAreaName, cityId: newAreaCityId }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to add area.');
      }
      setNewAreaName('');
      setNewAreaStateId('');
      setNewAreaCityId('');
      setNewAreaCities([]);
      fetchAreasPage(areaCurrentPage, areaSearch);
    } catch (err) {
      setAreaFormError(err.message);
    } finally {
      setAreaFormLoading(false);
    }
  };

  const handleDeleteArea = async (areaId) => {
    if (!window.confirm('Are you sure you want to delete this Area? Ensure no properties are linked to it.')) return;
    try {
      const res = await apiRequest(`/admin/locations/areas/${areaId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchAreasPage(areaCurrentPage, areaSearch);
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to delete area.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Role Guard Redirect
  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      router.replace('/dashboard');
    }
  }, [user, router]);

  useEffect(() => {
    fetchAmenities();
    fetchStates(); // Use public endpoint for the Add Property form dropdown
    
    if (user?.role === 'ADMIN') {
      fetchMyListings(myListingsPage, sellerFilterTitle, sellerFilterViewId);
      fetchMyLeads();
      fetchPendingListings();
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

  const fetchPendingListings = async () => {
    try {
      const res = await apiRequest('/admin/pending');
      if (res.ok) {
        const data = await res.json();
        setPendingListings(data.data.properties);
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

  // Admin Approval triggers
  const handleAdminApprove = async (pId) => {
    try {
      const res = await apiRequest(`/admin/approve/${pId}`, { method: 'PATCH' });
      if (res.ok) {
        fetchPendingListings();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdminReject = async (pId) => {
    try {
      const res = await apiRequest(`/admin/reject/${pId}`, { method: 'PATCH' });
      if (res.ok) {
        fetchPendingListings();
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

  const handleCopyEmail = (email) => {
    navigator.clipboard.writeText(email).then(() => {
      setCopiedText(email);
      setTimeout(() => setCopiedText(''), 3000);
    }).catch(err => console.error('Could not copy email:', err));
  };

  const renderSellerFilterForm = (isMobile = false) => {
    return (
      <form 
        onSubmit={(e) => {
          handleSellerSearch(e);
          if (isMobile) setShowMobileFilters(false);
        }} 
        className={isMobile ? "space-y-4" : "bg-cream/40 border border-caramel/25 p-5 rounded-3xl grid grid-cols-1 sm:grid-cols-3 gap-4 items-end shadow-sm"}
      >
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
            onClick={() => {
              handleSellerReset();
              if (isMobile) setShowMobileFilters(false);
            }}
            className="px-4 py-2.5 rounded-xl bg-caramel/10 hover:bg-caramel/20 text-brownie font-bold text-xs transition-colors cursor-pointer"
          >
            Reset
          </button>
        </div>
      </form>
    );
  };

  if (!user || user.role !== 'ADMIN') {
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
          role="ADMIN"
          pendingCount={pendingListings.length}
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
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brownie hover:bg-caramel text-cream font-bold text-xs transition-colors shadow-sm shadow-brownie/10 cursor-pointer animate-pulse duration-1000"
                  >
                    <PlusCircle className="h-4 w-4" />
                    New Listing
                  </button>
                </div>

                {/* Seller Filters Panel (Desktop View) */}
                <div className="hidden md:block">
                  {renderSellerFilterForm(false)}
                </div>

                {/* Mobile View Filter Button */}
                <div className="md:hidden">
                  <button
                    type="button"
                    onClick={() => setShowMobileFilters(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-brownie hover:bg-caramel text-cream font-bold rounded-2xl shadow-sm border border-caramel/30 text-sm cursor-pointer transition-colors"
                  >
                    <Filter className="h-4 w-4 text-caramel" /> Filter Listings
                  </button>
                </div>

                {/* Mobile Filter Drawer Overlay */}
                {showMobileFilters && (
                  <div className="fixed inset-0 z-50 flex justify-end md:hidden">
                    <div 
                      className="absolute inset-0 bg-black/55 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
                      onClick={() => setShowMobileFilters(false)}
                    />
                    <div className="relative w-full max-w-md bg-cream h-full shadow-2xl p-6 overflow-y-auto z-10 flex flex-col justify-between border-l border-caramel/30 animate-slide-right opacity-0 [animation-fill-mode:forwards] no-scrollbar">
                      <div>
                        <div className="flex justify-between items-center pb-4 border-b border-caramel/20 mb-6">
                          <h3 className="font-extrabold text-brownie text-lg flex items-center gap-2">
                            <Filter className="h-5 w-5 text-caramel" /> Filter Listings
                          </h3>
                          <button 
                            onClick={() => setShowMobileFilters(false)}
                            className="px-4 py-2 rounded-xl bg-caramel/10 text-brownie hover:bg-caramel/20 font-extrabold text-sm cursor-pointer"
                          >
                            Close
                          </button>
                        </div>
                        {renderSellerFilterForm(true)}
                      </div>
                    </div>
                  </div>
                )}

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

            {/* MODERATION TAB (Admin Only) */}
            {activeTab === 'MODERATION' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-extrabold text-brownie">Moderation Queue</h2>
                
                {pendingListings.length === 0 ? (
                  <div className="p-8 rounded-2xl border border-dashed border-caramel/30 text-center text-coffee font-semibold">
                    No pending properties to review. Good job!
                  </div>
                ) : (
                  <div className="space-y-6">
                    {pendingListings.map((listing) => (
                      <div key={listing.id} className="bg-cream/40 border border-caramel/20 p-6 rounded-3xl shadow-sm flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-1/3 h-48 bg-coffee/20 rounded-2xl overflow-hidden shrink-0">
                          {listing.images && listing.images.length > 0 ? (
                            <img src={listing.images[0].url} className="w-full h-full object-cover" alt="Pending property" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-coffee font-bold">No Image</div>
                          )}
                        </div>
                        
                        <div className="flex-grow flex flex-col justify-between space-y-4">
                          <div className="space-y-2">
                            <h4 className="font-extrabold text-brownie text-lg">{listing.title}</h4>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-coffee font-medium pb-1">
                              <span>Owner: <span className="font-extrabold text-brownie">{listing.owner.fullName}</span></span>
                              <div className="flex items-center gap-2">
                                <button 
                                  type="button"
                                  onClick={() => handleCopyEmail(listing.owner.email)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-caramel/10 hover:bg-caramel/20 text-brownie text-[10px] font-bold rounded-full transition-colors cursor-pointer"
                                  title="Click to copy email"
                                >
                                  <Mail className="h-3 w-3 text-caramel" />
                                  <span>Email</span>
                                </button>
                                {listing.owner.mobile ? (
                                  <a 
                                    href={`tel:${listing.owner.mobile}`}
                                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 text-[10px] font-bold rounded-full transition-colors cursor-pointer"
                                    title={`Call: ${listing.owner.mobile}`}
                                  >
                                    <Phone className="h-3 w-3 text-emerald-600" />
                                    <span>Phone: {listing.owner.mobile}</span>
                                  </a>
                                ) : (
                                  <button
                                    disabled
                                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-coffee/5 text-coffee/40 text-[10px] font-bold rounded-full cursor-not-allowed"
                                    title="No mobile number registered"
                                  >
                                    <Phone className="h-3 w-3 text-coffee/30" />
                                    <span>No Phone</span>
                                  </button>
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-coffee font-medium">Location: <span className="font-semibold">{listing.areaLocality?.name}, {listing.city?.name}, {listing.state?.name}</span></p>
                            <p className="text-sm font-extrabold text-brownie">₹{listing.price.toLocaleString('en-IN')} | {listing.area} Sq.Ft.</p>
                            <p className="text-xs text-coffee/80 leading-relaxed font-medium line-clamp-2">{listing.description}</p>
                          </div>
                          
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleAdminApprove(listing.id)}
                              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                              <CheckCircle className="h-4 w-4" /> Approve
                            </button>
                            <button
                              onClick={() => handleAdminReject(listing.id)}
                              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                              <XCircle className="h-4 w-4" /> Reject & Archive
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* USER_MASTER TAB (Admin Only) */}
            {activeTab === 'USER_MASTER' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-extrabold text-brownie">User Master</h2>
                    <p className="text-coffee text-xs font-semibold mt-1">Manage, edit and moderate user accounts in your system.</p>
                  </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-cream/40 border border-caramel/25 p-5 rounded-3xl grid grid-cols-1 sm:grid-cols-2 gap-4 items-end shadow-sm">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-brownie uppercase tracking-wider block">Search Users</label>
                    <div className="relative">
                      <input 
                        type="text"
                        value={userSearch}
                        onChange={(e) => { setUserSearch(e.target.value); setUserCurrentPage(1); }}
                        placeholder="Search by Name, Email, or Mobile..."
                        className="w-full pl-9 pr-4 py-2.5 bg-cream border border-caramel/20 rounded-xl text-xs text-brownie placeholder-coffee/40 font-medium focus:outline-none focus:ring-1 focus:ring-caramel"
                      />
                      <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-coffee/50" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-brownie uppercase tracking-wider block">Filter by Role</label>
                    <div className="relative">
                      <select 
                        value={userRoleFilter}
                        onChange={(e) => { setUserRoleFilter(e.target.value); setUserCurrentPage(1); }}
                        className="w-full pl-9 pr-4 py-2.5 bg-cream border border-caramel/20 rounded-xl text-xs text-brownie font-medium focus:outline-none focus:ring-1 focus:ring-caramel"
                      >
                        <option value="">All Roles</option>
                        <option value="BUYER">Buyer</option>
                        <option value="SELLER">Seller</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                      <Filter className="absolute left-3 top-3 h-3.5 w-3.5 text-coffee/50" />
                    </div>
                  </div>
                </div>

                {/* User List Table */}
                {loadingUsers ? (
                  <div className="flex justify-center py-12"><Loader2 className="animate-spin text-brownie h-8 w-8" /></div>
                ) : (
                  <div className="bg-cream/40 border border-caramel/20 rounded-3xl overflow-hidden shadow-sm">
                    {/* Desktop View Table */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-caramel/10 border-b border-caramel/20 text-[10px] font-bold text-brownie uppercase tracking-wider">
                            <th className="py-4 px-6">S.No</th>
                            <th className="py-4 px-6">Full Name</th>
                            <th className="py-4 px-6">Email</th>
                            <th className="py-4 px-6">Mobile</th>
                            <th className="py-4 px-6">Role</th>
                            <th className="py-4 px-6">Registered On</th>
                            <th className="py-4 px-6 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-caramel/10 text-xs font-semibold text-coffee">
                          {usersList.length === 0 ? (
                            <tr>
                              <td colSpan="7" className="py-8 px-6 text-center text-coffee font-semibold">
                                No users found matching filters.
                              </td>
                            </tr>
                          ) : usersList.map((userItem, idx) => (
                            <tr key={userItem.id} className="hover:bg-cream/30 transition-colors">
                              <td className="py-4 px-6 text-coffee/60 font-extrabold">{(userCurrentPage - 1) * PAGE_LIMIT + idx + 1}</td>
                              <td className="py-4 px-6 font-extrabold text-brownie">{userItem.fullName}</td>
                              <td className="py-4 px-6">{userItem.email}</td>
                              <td className="py-4 px-6">{userItem.mobile || '-'}</td>
                              <td className="py-4 px-6">
                                {userItem.role === 'ADMIN' && (
                                  <span className="px-2.5 py-1 rounded bg-rose-500/10 text-rose-600 border border-rose-500/20 text-[10px] font-bold uppercase tracking-wider">Admin</span>
                                )}
                                {userItem.role === 'SELLER' && (
                                  <span className="px-2.5 py-1 rounded bg-blue-500/10 text-blue-600 border border-blue-500/20 text-[10px] font-bold uppercase tracking-wider">Seller</span>
                                )}
                                {userItem.role === 'BUYER' && (
                                  <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider">Buyer</span>
                                )}
                              </td>
                              <td className="py-4 px-6">{new Date(userItem.createdAt).toLocaleDateString()}</td>
                              <td className="py-4 px-6 text-right space-x-2">
                                <button
                                  onClick={() => setEditingUser(userItem)}
                                  className="p-1.5 rounded-lg border border-caramel/30 hover:bg-caramel/10 text-brownie transition-colors cursor-pointer inline-flex items-center"
                                  title="Edit User"
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(userItem.id)}
                                  className="p-1.5 rounded-lg border border-rose-500/20 hover:bg-rose-500/10 text-rose-600 transition-colors cursor-pointer inline-flex items-center"
                                  title="Delete User"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile View Cards */}
                    <div className="block md:hidden divide-y divide-caramel/15">
                      {usersList.length === 0 ? (
                        <div className="py-8 px-6 text-center text-coffee font-semibold text-xs">
                          No users found matching filters.
                        </div>
                      ) : usersList.map((userItem, idx) => (
                        <div 
                          key={userItem.id} 
                          className="p-4 space-y-3 bg-cream/10 hover:bg-cream/20 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[9px] text-coffee/50 font-bold uppercase tracking-wider block">
                                User #{(userCurrentPage - 1) * PAGE_LIMIT + idx + 1}
                              </span>
                              <h4 className="font-extrabold text-brownie text-sm mt-0.5">{userItem.fullName}</h4>
                            </div>
                            <div>
                              {userItem.role === 'ADMIN' && (
                                <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 border border-rose-500/20 text-[9px] font-bold uppercase tracking-wider">Admin</span>
                              )}
                              {userItem.role === 'SELLER' && (
                                <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 border border-blue-500/20 text-[9px] font-bold uppercase tracking-wider">Seller</span>
                              )}
                              {userItem.role === 'BUYER' && (
                                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[9px] font-bold uppercase tracking-wider">Buyer</span>
                              )}
                            </div>
                          </div>

                          <div className="text-xs space-y-1 font-semibold text-coffee">
                            <div><span className="text-coffee/60">Email:</span> {userItem.email}</div>
                            <div><span className="text-coffee/60">Mobile:</span> {userItem.mobile || '-'}</div>
                            <div><span className="text-coffee/60">Registered:</span> {new Date(userItem.createdAt).toLocaleDateString()}</div>
                          </div>

                          <div className="flex justify-end gap-2 pt-2 border-t border-caramel/10">
                            <button
                              onClick={() => setEditingUser(userItem)}
                              className="px-3 py-1.5 rounded-lg border border-caramel/30 hover:bg-caramel/10 text-brownie transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
                            >
                              <Edit2 className="h-3 w-3" /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteUser(userItem.id)}
                              className="px-3 py-1.5 rounded-lg border border-rose-500/20 hover:bg-rose-500/10 text-rose-600 transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
                            >
                              <Trash2 className="h-3 w-3" /> Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Table Pagination — driven by server totalPages */}
                    {userTotalPages > 1 && (
                      <div className="flex justify-between items-center border-t border-caramel/15 p-4 bg-cream/10">
                        <button
                          type="button"
                          onClick={() => setUserCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={userCurrentPage === 1}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cream border border-caramel/20 hover:bg-caramel/10 text-coffee font-semibold text-[11px] transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          <ChevronLeft className="h-3.5 w-3.5" /> Prev
                        </button>
                        <span className="text-[11px] text-coffee font-bold">
                          Page {userCurrentPage} of {userTotalPages} &nbsp;·&nbsp; {userTotal} users total
                        </span>
                        <button
                          type="button"
                          onClick={() => setUserCurrentPage(prev => Math.min(userTotalPages, prev + 1))}
                          disabled={userCurrentPage === userTotalPages}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cream border border-caramel/20 hover:bg-caramel/10 text-coffee font-semibold text-[11px] transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          Next <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Edit User Modal Overlay */}
                {editingUser && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
                    <div className="bg-cream border border-caramel/30 rounded-3xl max-w-md w-full shadow-2xl p-6 relative animate-slide-up">
                      <h3 className="text-lg font-extrabold text-brownie border-b border-caramel/20 pb-3 mb-4">Edit User Account</h3>
                      
                      {editFormError && (
                        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-800 text-xs font-semibold mb-4">
                          {editFormError}
                        </div>
                      )}

                      <form onSubmit={handleUpdateUser} className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-brownie uppercase tracking-wider block">Full Name</label>
                          <input 
                            type="text" 
                            required
                            value={editFormFullName}
                            onChange={(e) => setEditFormFullName(e.target.value)}
                            className="w-full px-4 py-2.5 bg-cream/20 border border-caramel/25 rounded-xl text-xs text-brownie font-medium focus:ring-1 focus:ring-caramel focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-brownie uppercase tracking-wider block">Email Address</label>
                          <input 
                            type="email" 
                            required
                            value={editFormEmail}
                            onChange={(e) => setEditFormEmail(e.target.value)}
                            className="w-full px-4 py-2.5 bg-cream/20 border border-caramel/25 rounded-xl text-xs text-brownie font-medium focus:ring-1 focus:ring-caramel focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-brownie uppercase tracking-wider block">Mobile Number</label>
                          <input 
                            type="text" 
                            value={editFormMobile}
                            onChange={(e) => setEditFormMobile(e.target.value)}
                            className="w-full px-4 py-2.5 bg-cream/20 border border-caramel/25 rounded-xl text-xs text-brownie font-medium focus:ring-1 focus:ring-caramel focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-brownie uppercase tracking-wider block">System Role</label>
                          <select 
                            value={editFormRole}
                            onChange={(e) => setEditFormRole(e.target.value)}
                            className="w-full px-4 py-2.5 bg-cream/20 border border-caramel/25 rounded-xl text-xs text-brownie font-medium focus:ring-1 focus:ring-caramel focus:outline-none"
                          >
                            <option value="BUYER">Buyer</option>
                            <option value="SELLER">Seller</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                        </div>

                        <div className="flex gap-3 pt-4 border-t border-caramel/15">
                          <button
                            type="submit"
                            disabled={editFormLoading}
                            className="flex-grow py-2.5 bg-brownie hover:bg-caramel text-cream font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center disabled:opacity-70 cursor-pointer text-white"
                          >
                            {editFormLoading ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : 'Save Changes'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingUser(null)}
                            className="px-4 py-2.5 bg-caramel/15 hover:bg-caramel/25 text-brownie font-bold text-xs rounded-xl transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* LOCATION_MASTER TAB (Admin Only) */}
            {activeTab === 'LOCATION_MASTER' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-brownie">Location Master</h2>
                  <p className="text-coffee text-xs font-semibold mt-1">Manage geography records. Configure cascading States, Cities, and Areas.</p>
                </div>

                {/* Sub-Tabs for Location Elements */}
                <div className="flex border-b border-caramel/20 gap-2">
                  {['STATES', 'CITIES', 'AREAS'].map((tabName) => (
                    <button
                      key={tabName}
                      type="button"
                      onClick={() => setLocationSubTab(tabName)}
                      className={`px-5 py-2.5 font-bold text-xs border-t border-x rounded-t-xl transition-all cursor-pointer ${
                        locationSubTab === tabName
                          ? 'bg-cream/40 border-caramel/25 text-brownie border-b-cream font-extrabold shadow-sm'
                          : 'border-transparent text-coffee/60 hover:text-coffee'
                      }`}
                    >
                      {tabName === 'STATES' ? 'States' : tabName === 'CITIES' ? 'Cities / Districts' : 'Areas / Localities'}
                    </button>
                  ))}
                </div>

                {/* STATES TAB VIEW */}
                {locationSubTab === 'STATES' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    {/* Add State Form */}
                    <div className="bg-cream/40 border border-caramel/25 p-5 rounded-3xl shadow-sm space-y-4">
                      <h4 className="font-extrabold text-brownie text-sm border-b border-caramel/15 pb-2">Add New State</h4>
                      {stateFormError && <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-800 text-xs font-semibold">{stateFormError}</div>}
                      <form onSubmit={handleAddState} className="space-y-3.5">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-brownie uppercase tracking-wider block">State Name</label>
                          <input 
                            type="text" 
                            required
                            value={newStateName}
                            onChange={(e) => setNewStateName(e.target.value)}
                            placeholder="e.g. Tamil Nadu"
                            className="w-full px-4 py-2.5 bg-cream border border-caramel/20 rounded-xl text-xs text-brownie font-medium placeholder-coffee/40 focus:ring-1 focus:ring-caramel focus:outline-none"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={stateFormLoading}
                          className="w-full py-2.5 bg-brownie hover:bg-caramel text-cream font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center cursor-pointer text-white"
                        >
                          {stateFormLoading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Add State'}
                        </button>
                      </form>
                    </div>

                    {/* States List Table */}
                    <div className="md:col-span-2 space-y-3">
                      <div className="bg-cream/40 border border-caramel/25 p-4 rounded-2xl flex items-center shadow-sm">
                        <div className="relative w-full">
                          <input 
                            type="text"
                            value={stateSearch}
                            onChange={(e) => { setStateSearch(e.target.value); setStateCurrentPage(1); }}
                            placeholder="Search states..."
                            className="w-full pl-9 pr-4 py-2 bg-cream border border-caramel/20 rounded-xl text-xs text-brownie placeholder-coffee/40 font-medium focus:outline-none"
                          />
                          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-coffee/50" />
                        </div>
                      </div>

                      {loadingStates ? (
                        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-brownie h-8 w-8" /></div>
                      ) : (
                        <div className="bg-cream/40 border border-caramel/20 rounded-3xl overflow-hidden shadow-sm">
                          {/* Desktop View Table */}
                          <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="bg-caramel/10 border-b border-caramel/20 text-[10px] font-bold text-brownie uppercase tracking-wider">
                                  <th className="py-3 px-6">S.No</th>
                                  <th className="py-3 px-6">State Name</th>
                                  <th className="py-3 px-6 text-right">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-caramel/10 text-xs font-semibold text-coffee">
                                {statesList.length === 0 ? (
                                  <tr><td colSpan="3" className="py-6 px-6 text-center text-coffee/60">No states found.</td></tr>
                                ) : statesList.map((s, idx) => (
                                  <tr key={s.id} className="hover:bg-cream/30">
                                    <td className="py-3 px-6 font-extrabold text-coffee/60">{(stateCurrentPage - 1) * PAGE_LIMIT + idx + 1}</td>
                                    <td className="py-3 px-6 font-extrabold text-brownie">{s.name}</td>
                                    <td className="py-3 px-6 text-right">
                                      <button
                                        onClick={() => handleDeleteState(s.id)}
                                        className="p-1.5 rounded-lg border border-rose-500/20 hover:bg-rose-500/10 text-rose-600 transition-colors cursor-pointer inline-flex items-center"
                                        title="Delete State"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Mobile View Cards */}
                          <div className="block md:hidden divide-y divide-caramel/15">
                            {statesList.length === 0 ? (
                              <div className="py-6 px-6 text-center text-xs font-semibold text-coffee/60">No states found.</div>
                            ) : statesList.map((s, idx) => (
                              <div key={s.id} className="p-4 flex justify-between items-center bg-cream/10 hover:bg-cream/20 transition-colors">
                                <div>
                                  <span className="text-[9px] text-coffee/50 font-bold uppercase tracking-wider">State #{(stateCurrentPage - 1) * PAGE_LIMIT + idx + 1}</span>
                                  <h4 className="font-extrabold text-brownie text-sm mt-0.5">{s.name}</h4>
                                </div>
                                <button
                                  onClick={() => handleDeleteState(s.id)}
                                  className="p-2 rounded-xl border border-rose-500/20 hover:bg-rose-500/10 text-rose-600 transition-colors cursor-pointer flex items-center justify-center animate-none"
                                  title="Delete State"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>

                          {stateTotalPages > 1 && (
                            <div className="flex justify-between items-center border-t border-caramel/15 p-4 bg-cream/10">
                              <button type="button" onClick={() => setStateCurrentPage(prev => Math.max(1, prev - 1))} disabled={stateCurrentPage === 1} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cream border border-caramel/20 hover:bg-caramel/10 text-coffee font-semibold text-[11px] transition-colors disabled:opacity-50 cursor-pointer">
                                <ChevronLeft className="h-3.5 w-3.5" /> Prev
                              </button>
                              <span className="text-[11px] text-coffee font-bold">Page {stateCurrentPage} of {stateTotalPages} &nbsp;·&nbsp; {stateTotal} total</span>
                              <button type="button" onClick={() => setStateCurrentPage(prev => Math.min(stateTotalPages, prev + 1))} disabled={stateCurrentPage === stateTotalPages} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cream border border-caramel/20 hover:bg-caramel/10 text-coffee font-semibold text-[11px] transition-colors disabled:opacity-50 cursor-pointer">
                                Next <ChevronRight className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* CITIES TAB VIEW */}
                {locationSubTab === 'CITIES' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    {/* Add City Form */}
                    <div className="bg-cream/40 border border-caramel/25 p-5 rounded-3xl shadow-sm space-y-4">
                      <h4 className="font-extrabold text-brownie text-sm border-b border-caramel/15 pb-2">Add New City / District</h4>
                      {cityFormError && <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-800 text-xs font-semibold">{cityFormError}</div>}
                      <form onSubmit={handleAddCity} className="space-y-3.5">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-brownie uppercase tracking-wider block">State</label>
                          <select 
                            required
                            value={newCityStateId}
                            onChange={(e) => setNewCityStateId(e.target.value)}
                            className="w-full px-4 py-2.5 bg-cream border border-caramel/20 rounded-xl text-xs text-brownie font-medium focus:ring-1 focus:ring-caramel focus:outline-none"
                          >
                            <option value="">Select State</option>
                            {statesList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-brownie uppercase tracking-wider block">City / District Name</label>
                          <input 
                            type="text" 
                            required
                            value={newCityName}
                            onChange={(e) => setNewCityName(e.target.value)}
                            placeholder="e.g. Madurai"
                            className="w-full px-4 py-2.5 bg-cream border border-caramel/20 rounded-xl text-xs text-brownie font-medium placeholder-coffee/40 focus:ring-1 focus:ring-caramel focus:outline-none"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={cityFormLoading}
                          className="w-full py-2.5 bg-brownie hover:bg-caramel text-cream font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center cursor-pointer text-white"
                        >
                          {cityFormLoading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Add City'}
                        </button>
                      </form>
                    </div>

                    {/* Cities List Table */}
                    <div className="md:col-span-2 space-y-3">
                      <div className="bg-cream/40 border border-caramel/25 p-4 rounded-2xl flex items-center shadow-sm">
                        <div className="relative w-full">
                          <input 
                            type="text"
                            value={citySearch}
                            onChange={(e) => { setCitySearch(e.target.value); setCityCurrentPage(1); }}
                            placeholder="Search cities/districts..."
                            className="w-full pl-9 pr-4 py-2 bg-cream border border-caramel/20 rounded-xl text-xs text-brownie placeholder-coffee/40 font-medium focus:outline-none"
                          />
                          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-coffee/50" />
                        </div>
                      </div>

                      {loadingCities ? (
                        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-brownie h-8 w-8" /></div>
                      ) : (
                        <div className="bg-cream/40 border border-caramel/20 rounded-3xl overflow-hidden shadow-sm">
                          {/* Desktop View Table */}
                          <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="bg-caramel/10 border-b border-caramel/20 text-[10px] font-bold text-brownie uppercase tracking-wider">
                                  <th className="py-3 px-6">S.No</th>
                                  <th className="py-3 px-6">City/District</th>
                                  <th className="py-3 px-6">Parent State</th>
                                  <th className="py-3 px-6 text-right">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-caramel/10 text-xs font-semibold text-coffee">
                                {allCitiesList.length === 0 ? (
                                  <tr><td colSpan="4" className="py-6 px-6 text-center text-coffee/60">No cities found.</td></tr>
                                ) : allCitiesList.map((c, idx) => (
                                  <tr key={c.id} className="hover:bg-cream/30">
                                    <td className="py-3 px-6 text-coffee/60">{(cityCurrentPage - 1) * PAGE_LIMIT + idx + 1}</td>
                                    <td className="py-3 px-6 font-extrabold text-brownie">{c.name}</td>
                                    <td className="py-3 px-6 text-coffee/80">{c.state?.name || '-'}</td>
                                    <td className="py-3 px-6 text-right">
                                      <button onClick={() => handleDeleteCity(c.id)} className="p-1.5 rounded-lg border border-rose-500/20 hover:bg-rose-500/10 text-rose-600 transition-colors cursor-pointer inline-flex items-center" title="Delete City">
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Mobile View Cards */}
                          <div className="block md:hidden divide-y divide-caramel/15">
                            {allCitiesList.length === 0 ? (
                              <div className="py-6 px-6 text-center text-xs font-semibold text-coffee/60">No cities found.</div>
                            ) : allCitiesList.map((c, idx) => (
                              <div key={c.id} className="p-4 flex justify-between items-center bg-cream/10 hover:bg-cream/20 transition-colors">
                                <div>
                                  <span className="text-[9px] text-coffee/50 font-bold uppercase tracking-wider">City #{(cityCurrentPage - 1) * PAGE_LIMIT + idx + 1}</span>
                                  <h4 className="font-extrabold text-brownie text-sm mt-0.5">{c.name}</h4>
                                  <span className="text-xs text-coffee/80 block mt-0.5">State: {c.state?.name || '-'}</span>
                                </div>
                                <button
                                  onClick={() => handleDeleteCity(c.id)}
                                  className="p-2 rounded-xl border border-rose-500/20 hover:bg-rose-500/10 text-rose-600 transition-colors cursor-pointer flex items-center justify-center"
                                  title="Delete City"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>

                          {cityTotalPages > 1 && (
                            <div className="flex justify-between items-center border-t border-caramel/15 p-4 bg-cream/10">
                              <button type="button" onClick={() => setCityCurrentPage(prev => Math.max(1, prev - 1))} disabled={cityCurrentPage === 1} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cream border border-caramel/20 hover:bg-caramel/10 text-coffee font-semibold text-[11px] transition-colors disabled:opacity-50 cursor-pointer">
                                <ChevronLeft className="h-3.5 w-3.5" /> Prev
                              </button>
                              <span className="text-[11px] text-coffee font-bold">Page {cityCurrentPage} of {cityTotalPages} &nbsp;·&nbsp; {cityTotal} total</span>
                              <button type="button" onClick={() => setCityCurrentPage(prev => Math.min(cityTotalPages, prev + 1))} disabled={cityCurrentPage === cityTotalPages} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cream border border-caramel/20 hover:bg-caramel/10 text-coffee font-semibold text-[11px] transition-colors disabled:opacity-50 cursor-pointer">
                                Next <ChevronRight className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* AREAS TAB VIEW */}
                {locationSubTab === 'AREAS' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    {/* Add Area Form */}
                    <div className="bg-cream/40 border border-caramel/25 p-5 rounded-3xl shadow-sm space-y-4">
                      <h4 className="font-extrabold text-brownie text-sm border-b border-caramel/15 pb-2">Add New Area / Locality</h4>
                      {areaFormError && <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-800 text-xs font-semibold">{areaFormError}</div>}
                      <form onSubmit={handleAddArea} className="space-y-3.5">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-brownie uppercase tracking-wider block">State</label>
                          <select 
                            required
                            value={newAreaStateId}
                            onChange={(e) => setNewAreaStateId(e.target.value)}
                            className="w-full px-4 py-2.5 bg-cream border border-caramel/20 rounded-xl text-xs text-brownie font-medium focus:ring-1 focus:ring-caramel focus:outline-none"
                          >
                            <option value="">Select State</option>
                            {statesList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-brownie uppercase tracking-wider block">City / District</label>
                          <select 
                            required
                            disabled={!newAreaStateId}
                            value={newAreaCityId}
                            onChange={(e) => setNewAreaCityId(e.target.value)}
                            className="w-full px-4 py-2.5 bg-cream border border-caramel/20 rounded-xl text-xs text-brownie font-medium focus:ring-1 focus:ring-caramel focus:outline-none disabled:opacity-50"
                          >
                            <option value="">Select City</option>
                            {newAreaCities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-brownie uppercase tracking-wider block">Area / Locality Name</label>
                          <input 
                            type="text" 
                            required
                            value={newAreaName}
                            onChange={(e) => setNewAreaName(e.target.value)}
                            placeholder="e.g. KK Nagar"
                            className="w-full px-4 py-2.5 bg-cream border border-caramel/20 rounded-xl text-xs text-brownie font-medium placeholder-coffee/40 focus:ring-1 focus:ring-caramel focus:outline-none"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={areaFormLoading}
                          className="w-full py-2.5 bg-brownie hover:bg-caramel text-cream font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center cursor-pointer text-white"
                        >
                          {areaFormLoading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Add Area'}
                        </button>
                      </form>
                    </div>

                    {/* Areas List Table */}
                    <div className="md:col-span-2 space-y-3">
                      <div className="bg-cream/40 border border-caramel/25 p-4 rounded-2xl flex items-center shadow-sm">
                        <div className="relative w-full">
                          <input 
                            type="text"
                            value={areaSearch}
                            onChange={(e) => { setAreaSearch(e.target.value); setAreaCurrentPage(1); }}
                            placeholder="Search areas/localities..."
                            className="w-full pl-9 pr-4 py-2 bg-cream border border-caramel/20 rounded-xl text-xs text-brownie placeholder-coffee/40 font-medium focus:outline-none"
                          />
                          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-coffee/50" />
                        </div>
                      </div>

                      {loadingAreas ? (
                        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-brownie h-8 w-8" /></div>
                      ) : (
                        <div className="bg-cream/40 border border-caramel/20 rounded-3xl overflow-hidden shadow-sm">
                          {/* Desktop View Table */}
                          <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="bg-caramel/10 border-b border-caramel/20 text-[10px] font-bold text-brownie uppercase tracking-wider">
                                  <th className="py-3 px-6">S.No</th>
                                  <th className="py-3 px-6">Area/Locality</th>
                                  <th className="py-3 px-6">City</th>
                                  <th className="py-3 px-6">State</th>
                                  <th className="py-3 px-6 text-right">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-caramel/10 text-xs font-semibold text-coffee">
                                {allAreasList.length === 0 ? (
                                  <tr><td colSpan="5" className="py-6 px-6 text-center text-coffee/60">No areas found.</td></tr>
                                ) : allAreasList.map((a, idx) => (
                                  <tr key={a.id} className="hover:bg-cream/30">
                                    <td className="py-3 px-6 text-coffee/60">{(areaCurrentPage - 1) * PAGE_LIMIT + idx + 1}</td>
                                    <td className="py-3 px-6 font-extrabold text-brownie">{a.name}</td>
                                    <td className="py-3 px-6 text-coffee/80">{a.city?.name || '-'}</td>
                                    <td className="py-3 px-6 text-coffee/60">{a.city?.state?.name || '-'}</td>
                                    <td className="py-3 px-6 text-right">
                                      <button onClick={() => handleDeleteArea(a.id)} className="p-1.5 rounded-lg border border-rose-500/20 hover:bg-rose-500/10 text-rose-600 transition-colors cursor-pointer inline-flex items-center" title="Delete Area">
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Mobile View Cards */}
                          <div className="block md:hidden divide-y divide-caramel/15">
                            {allAreasList.length === 0 ? (
                              <div className="py-6 px-6 text-center text-xs font-semibold text-coffee/60">No areas found.</div>
                            ) : allAreasList.map((a, idx) => (
                              <div key={a.id} className="p-4 flex justify-between items-center bg-cream/10 hover:bg-cream/20 transition-colors">
                                <div>
                                  <span className="text-[9px] text-coffee/50 font-bold uppercase tracking-wider">Area #{(areaCurrentPage - 1) * PAGE_LIMIT + idx + 1}</span>
                                  <h4 className="font-extrabold text-brownie text-sm mt-0.5">{a.name}</h4>
                                  <span className="text-xs text-coffee/80 block mt-0.5">City: {a.city?.name || '-'}</span>
                                  <span className="text-xs text-coffee/60 block mt-0.5">State: {a.city?.state?.name || '-'}</span>
                                </div>
                                <button
                                  onClick={() => handleDeleteArea(a.id)}
                                  className="p-2 rounded-xl border border-rose-500/20 hover:bg-rose-500/10 text-rose-600 transition-colors cursor-pointer flex items-center justify-center animate-none"
                                  title="Delete Area"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>

                          {areaTotalPages > 1 && (
                            <div className="flex justify-between items-center border-t border-caramel/15 p-4 bg-cream/10">
                              <button type="button" onClick={() => setAreaCurrentPage(prev => Math.max(1, prev - 1))} disabled={areaCurrentPage === 1} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cream border border-caramel/20 hover:bg-caramel/10 text-coffee font-semibold text-[11px] transition-colors disabled:opacity-50 cursor-pointer">
                                <ChevronLeft className="h-3.5 w-3.5" /> Prev
                              </button>
                              <span className="text-[11px] text-coffee font-bold">Page {areaCurrentPage} of {areaTotalPages} &nbsp;·&nbsp; {areaTotal} total</span>
                              <button type="button" onClick={() => setAreaCurrentPage(prev => Math.min(areaTotalPages, prev + 1))} disabled={areaCurrentPage === areaTotalPages} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cream border border-caramel/20 hover:bg-caramel/10 text-coffee font-semibold text-[11px] transition-colors disabled:opacity-50 cursor-pointer">
                                Next <ChevronRight className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

          </main>
        </div>

        {copiedText && (
          <div className="fixed bottom-5 right-5 z-50 bg-brownie text-cream px-5 py-3.5 rounded-2xl shadow-lg border border-caramel/30 text-xs font-bold flex items-center gap-2 animate-slide-right opacity-0 [animation-fill-mode:forwards]">
            <CheckCircle className="h-4 w-4 text-emerald-400" />
            <span>Copied: {copiedText} to clipboard!</span>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
