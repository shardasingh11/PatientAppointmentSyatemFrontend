import React from 'react';
import { User, CheckSquare, X, Clock } from 'lucide-react';

const AdminDoctorProfile = ({
  doctor,
  onClose,
  onStatusChange,
  showModal,
}) => {
  // Skip rendering if not showing or no doctor selected
  if (!showModal || !doctor) return null;

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

  // Get status badge style based on verification status
  const getStatusBadge = (status) => {
    switch (status) {
      case 'verified':
        return (
          <span className="flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
            <CheckSquare size={14} className="mr-1" />
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
            <X size={14} className="mr-1" />
            Unknown
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <X size={24} aria-hidden="true" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 className="text-2xl leading-6 font-bold text-gray-900 mb-4">
                Doctor Profile
              </h3>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <div className="flex-shrink-0 h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto sm:mx-0">
                    <User className="text-blue-600" size={40} />
                  </div>
                  <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
                    <p className="text-xl font-bold text-gray-900">{doctor?.user?.name}</p>
                    <p className="text-md text-gray-600">{doctor?.specialty}</p>
                    <div className="mt-2">
                      {getStatusBadge(doctor?.DoctorVerification?.[0].status)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 py-5">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">{doctor?.user?.email}</dd>
                  </div>

                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Consultation fee</dt>
                    <dd className="mt-1 text-sm text-gray-900">${doctor?.consultation_fee}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Verification Request</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formatDate(doctor.DoctorVerification?.[0]?.requested_at)}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Experience</dt>
                    <dd className="mt-1 text-sm text-gray-900">{doctor.experience}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Qualification</dt>
                    <dd className="mt-1 text-sm text-gray-900">{doctor?.qualifications?.[0]?.qualification_name}</dd>
                  </div>  
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Course Duration</dt>
                    <dd className="mt-1 text-sm text-gray-900">{doctor?.qualifications?.[0]?.course_duration}</dd>
                  </div>

                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Qualification</dt>
                    <dd className="mt-1 text-sm text-gray-900">{doctor?.qualifications?.[0]?.year_completed}</dd>
                  </div> 
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Institute</dt>
                    <dd className="mt-1 text-sm text-gray-900">{doctor?.qualifications?.[0]?.institute?.name}</dd>
                    
                  </div>
                  <div className='sm:col-span-1'>
                    <dt className="text-sm font-medium text-gray-500">Institute Type</dt>
                    <dd className="mt-1 text-sm text-gray-900">{doctor?.qualifications?.[0]?.institute?.type}</dd>
                  </div>   

                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Clinic</dt>
                    <dd className="mt-1 text-sm text-gray-900">{doctor?.clinics?.[0]?.clinic_info?.clinic_name}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Clinic Phone no.</dt>
                    <dd className="mt-1 text-sm text-gray-900">{doctor?.clinics?.[0]?.clinic_info?.clinic_phone}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Clinic Address</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {doctor?.clinics?.[0]?.clinic_address &&
                        `${doctor.clinics[0].clinic_address.street_address}, ${doctor.clinics[0].clinic_address.area_name}, ${doctor.clinics[0].clinic_address.city}, ${doctor.clinics[0].clinic_address.state} - ${doctor.clinics[0].clinic_address.pincode}, ${doctor.clinics[0].clinic_address.country}`
                      }
                    </dd>
                  </div>

                </dl>
              </div>

              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
                {doctor.status !== 'verified' && (
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => onStatusChange(doctor.id, doctor.DoctorVerification[0].id, 'verified')}
                  >
                    <CheckSquare size={16} className="mr-2" />
                    Verify Doctor
                  </button>
                )}

                {doctor.status !== 'rejected' && (
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => onStatusChange(doctor.id, doctor.DoctorVerification[0].id, 'rejected')}
                  >
                    <X size={16} className="mr-2" />
                    Reject
                  </button>
                )}

                {doctor.status !== 'pending' && (
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => onStatusChange(doctor.id, doctor.DoctorVerification[0].id, 'pending')}
                  >
                    <Clock size={16} className="mr-2" />
                    Mark as Pending
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDoctorProfile;