import React, { useState } from 'react';
import { 
  CheckCircle, 
  Clock, 
  User, 
  Search, 
  Filter, 
  Eye, 
  X,
  AlertCircle
} from 'lucide-react';
import AdminDoctorProfile from './AdminDoctorProfile';

const AdminDashboard = () => {
  // Mock data for doctors awaiting verification
  const [doctors, setDoctors] = useState([
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      requestTime: "2025-04-23T14:30:00",
      status: "pending",
      email: "sarah.johnson@example.com",
      phone: "+1 (555) 123-4567",
      licenseNumber: "MED12345678",
      experience: "15 years",
      qualification: "MD, Cardiology, Harvard Medical School"
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "Pediatrician",
      requestTime: "2025-04-24T09:15:00",
      status: "pending",
      email: "michael.chen@example.com",
      phone: "+1 (555) 987-6543",
      licenseNumber: "MED87654321",
      experience: "15 years",
      qualification: "MD, Cardiology, Harvard Medical School"
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      specialty: "Neurologist",
      requestTime: "2025-04-24T16:45:00",
      status: "verified",
      email: "emily.rodriguez@example.com",
      phone: "+1 (555) 456-7890",
      licenseNumber: "MED45678901",
      experience: "15 years",
      qualification: "MD, Cardiology, Harvard Medical School"
    },
    {
      id: 4,
      name: "Dr. James Wilson",
      specialty: "Dermatologist",
      requestTime: "2025-04-25T11:20:00",
      status: "pending",
      email: "james.wilson@example.com",
      phone: "+1 (555) 234-5678",
      licenseNumber: "MED23456789",
      experience: "15 years",
      qualification: "MD, Cardiology, Harvard Medical School"
    },
    {
      id: 5,
      name: "Dr. Olivia Taylor",
      specialty: "Orthopedic Surgeon",
      requestTime: "2025-04-25T13:10:00",
      status: "rejected",
      email: "olivia.taylor@example.com",
      phone: "+1 (555) 345-6789",
      licenseNumber: "MED34567890",
      experience: "15 years",
      qualification: "MD, Cardiology, Harvard Medical School"
    }
  ]);

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

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

  // Handle verification status change
  const handleVerificationChange = (doctorId, newStatus) => {
    setDoctors(doctors.map(doctor => 
      doctor.id === doctorId ? { ...doctor, status: newStatus } : doctor
    ));
    setShowProfileModal(false);
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


  // Get status badge style based on verification status
  const getStatusBadge = (status) => {
    switch(status) {
      case 'verified':
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600">Manage doctor verification requests and track system status</p>
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
              {doctors.length > 0 ? (
                doctors.map((doctor) => (
                  <tr key={doctor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-blue-100 rounded-full">
                          <User className="text-blue-600" size={20} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
                          <div className="text-sm text-gray-500">{doctor.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{doctor.specialty}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(doctor.requestTime)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(doctor.status)}
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
        onStatusChange={handleVerificationChange}
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
                {doctors.filter(d => d.status === 'pending').length}
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
                {doctors.filter(d => d.status === 'verified').length}
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
                {doctors.filter(d => d.status === 'rejected').length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;