import React, { useEffect, useState } from 'react';
import {
  CheckCircle,
  Clock,
  User,
  Search,
  Filter,
  Eye,
  X,
  AlertCircle,
  ChevronDown
} from 'lucide-react';
import AdminDoctorProfile from './AdminDoctorProfile';
import { useAuth } from '../context/AuthContext';


const AdminDashboard = () => {

  const { token } = useAuth();
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);



  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [specialties, setSpecialties] = useState([]);


  useEffect(() => {

    if (token) {
      fetchDoctorProfileWithVerification()
        .then((response) => {
          setDoctors(response);
          setFilteredDoctors(response);


          // Extract unique specialties for filter dropdown
          const uniqueSpecialties = [...new Set(response.map(doctor => doctor.speciality))];
          setSpecialties(uniqueSpecialties);
          console.log("logging doctor and verification data", response);
        })
    }
  }, [token]);

  // calling the get_doctor_verification api
  const fetchDoctorProfileWithVerification = async () => {
    try {
      const response = await fetch("http://localhost:8000/admin/dcotor-profile-with-doctor-verifications/", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch doctor profile with doctor verification');
      }

      const data = await response.json()
      // console.log("logging doctor profile data with verification",data);
      return data;


    } catch (err) {
      setError('Error loading doctor profile with doctor verification. Please try again later.');
      console.error('Error fetching doctor profile with doctor verification:', err);
    } finally {
      setLoading(false);
    }

  }


  // Apply filters when any filter criteria changes
  useEffect(() => {
    applyFilters();
  }, [searchTerm, statusFilter, specialtyFilter, doctors]);

  // Apply all filters
  const applyFilters = () => {
    let filtered = [...doctors];

    // Apply search term filter
    if (searchTerm) {
      filtered = filtered.filter(doctor => 
        doctor.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.speciality?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(doctor => 
        doctor.DoctorVerification?.some(verification => verification.status === statusFilter)
      );
    }

    // Apply specialty filter
    if (specialtyFilter !== 'all') {
      filtered = filtered.filter(doctor => doctor.speciality === specialtyFilter);
    }

    setFilteredDoctors(filtered);
  };







  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
 

  // View doctor profile
  const viewDoctorProfile = (doctor) => {
    setSelectedDoctor(doctor);
    setShowProfileModal(true);
  };

  // Close doctor profile modal
  const closeProfileModal = () => {
    setShowProfileModal(false);
  };


  
  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setSpecialtyFilter('all');
  };

  // Get status badge style based on verification status
  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
            <CheckCircle size={14} className="mr-1" />
            Verified
          </span>
        );
      case 'pending':
        return (
          <span className="flex items-center px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
            <Clock size={14} className="mr-1" />
            Pending
          </span>
        );
      case 'rejected':
        return (
          <span className="flex items-center px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
            <X size={14} className="mr-1" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
            <AlertCircle size={14} className="mr-1" />
            Unknown
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4  border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading doctor profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (

    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600">Manage doctor verification requests and track system status</p>
      </div>


      
      {/* Filters Section */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
          {/* Search Bar */}
          <div className="relative w-full md:w-1/3">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search by name, email, specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Filter className="h-5 w-5 mr-2" />
            Filters
            <ChevronDown className={`h-4 w-4 ml-1 transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Verification Status
              </label>
              <select
                id="status-filter"
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Specialty Filter */}
            <div>
              <label htmlFor="specialty-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Specialty
              </label>
              <select
                id="specialty-filter"
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={specialtyFilter}
                onChange={(e) => setSpecialtyFilter(e.target.value)}
              >
                <option value="all">All Specialties</option>
                {specialties.map((specialty, index) => (
                  <option key={index} value={specialty}>{specialty}</option>
                ))}
              </select>
            </div>

            {/* Reset Filters Button */}
            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Doctors Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Specialty
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor) => (


                  <tr key={doctor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-blue-100 rounded-full">
                          <User className="text-blue-600" size={20} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{doctor.user?.name}</div>
                          <div className="text-sm text-gray-500">{doctor?.user?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{doctor.speciality}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">

                      <div className="text-sm text-gray-900">{formatDate(doctor.DoctorVerification?.[0]?.requested_at)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(doctor.DoctorVerification?.[0]?.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => viewDoctorProfile(doctor)}
                        className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Eye size={16} className="mr-1" />
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    No doctors found matching your search criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Doctor Profile Modal */}
      <AdminDoctorProfile
        doctor={selectedDoctor}
        showModal={showProfileModal}
        onClose={closeProfileModal}
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex items-center justify-center p-3 rounded-full bg-blue-100">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Pending Verifications</h3>
              <p className="text-2xl font-semibold text-gray-700">
                {doctors.filter(d => d.DoctorVerification?.[0]?.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex items-center justify-center p-3 rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Verified Doctors</h3>
              <p className="text-2xl font-semibold text-gray-700">
                {doctors.filter(d => d.DoctorVerification?.[0]?.status === 'verified').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex items-center justify-center p-3 rounded-full bg-red-100">
              <X className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Rejected Applications</h3>
              <p className="text-2xl font-semibold text-gray-700">
                {doctors.filter(d => d.DoctorVerification?.[0]?.status === 'rejected').length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};

export default AdminDashboard;