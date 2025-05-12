import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { User, Award, Clock, MapPin, Phone, Calendar, Check, X, Home} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';






const DoctorsListForPatient = () => {

    const navigate = useNavigate();
    const [doctors, setDoctors] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();
    const [activeTab, setActiveTab] = useState('all');



    // Function to Fetch the Doctors
    const fetchDoctorsList = async () => {
        try {
            const response = await fetch("http://localhost:8000/patient/doctors-list", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`

                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to Fetch Doctors List');
            }

            const data = await response.json()
            return data;


        } catch (err) {
            setError("Failed to fetch doctors list. try again later!")
            console.error(err);
        }
    }

    useEffect(() => {
        if (!token) {
            setLoading(true);
            setTimeout(() => {
                 navigate(`/login-page`);
            }, 1000);
            return;
        }
        fetchDoctorsList()
            .then((response) => {
                setLoading(false);
                setDoctors(response);
                console.log("Doctors List for patients", response);
            })


    }, [token]);

    // Get unique specialties for filtering
    const specialties = doctors ?
        [...new Set(doctors.map(doctor => doctor.speciality.toLowerCase()))] : [];


    // Handle Loading 

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8 flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                    <p className="mt-4 text-gray-600">Loading Doctors profile...</p>
                </div>
            </div>
        );
    }


    // Filter doctors based on active tab
    const filteredDoctors = doctors && activeTab !== 'all'
        ? doctors.filter(doctor => doctor.speciality.toLowerCase() === activeTab)
        : doctors;

    // Handling Error
    if (error) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error! </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 bg-gray-50">
            {/* Header with improved styling */}
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-blue-800 mb-2">Find Your Specialist</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Schedule appointments with our expert doctors specializing in various medical fields
                </p>
            </div>

            {/* Filter Tabs */}
            {doctors && doctors.length > 0 && (
                <div className="mb-8 flex justify-center overflow-x-auto">
                    <div className="inline-flex p-1 bg-white rounded-lg shadow-sm">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`px-5 py-2 rounded-md font-medium text-sm transition-all ${activeTab === 'all'
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            All Doctors
                        </button>

                        {specialties.map(specialty => (
                            <button
                                key={specialty}
                                onClick={() => setActiveTab(specialty)}
                                className={`px-5 py-2 rounded-md font-medium text-sm transition-all ${activeTab === specialty
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                {specialty.charAt(0).toUpperCase() + specialty.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            )}

             {doctors && doctors.length > 0 ? (
                <div className="space-y-4">
                    {filteredDoctors.map((doctor) => (
                        <div key={doctor.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="p-6">
                                <div className="flex justify-between items-start">
                                    {/* Left Section - Doctor Info */}
                                    <div className="flex gap-4">
                                        {/* Doctor Avatar */}
                                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <User className="text-blue-600" size={24} />
                                        </div>

                                        {/* Doctor Details */}
                                        <div className="flex-1">
                                            {/* Name and Verified Status */}
                                            <div className="flex items-center gap-2 mb-1">
                                                <h2 className="text-xl font-semibold text-gray-800">
                                                    {doctor.user?.name}
                                                </h2>
                                                {doctor.is_verified ? (
                                                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                                                        <Check size={12} className="mr-1" /> Verified
                                                    </span>
                                                ) : (
                                                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full flex items-center">
                                                        <X size={12} className="mr-1" /> Not Verified
                                                    </span>
                                                )}
                                            </div>

                                            {/* Speciality */}
                                            <p className="text-gray-600 mb-2">{doctor.speciality}</p>

                                            {/* Experience */}
                                            <div className="flex items-center text-gray-600 text-sm mb-3">
                                                <Clock size={16} className="mr-1" />
                                                <span>{doctor.experience} years experience</span>
                                            </div>

                                            {/* Clinic Info */}
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                                {/* Clinic Name */}
                                                {doctor.clinics && doctor.clinics[0]?.clinic_info?.clinic_name && (
                                                    <div className="flex items-center">
                                                        <Home size={16} className="mr-1 text-gray-400" />
                                                        <span>{doctor.clinics[0].clinic_info.clinic_name}</span>
                                                    </div>
                                                )}

                                                {/* Clinic Address */}
                                                {doctor.clinics && doctor.clinics[0]?.clinic_address && (
                                                    <div className="flex items-center">
                                                        <MapPin size={16} className="mr-1 text-gray-400" />
                                                        <span>
                                                            {doctor.clinics[0].clinic_address.area_name}, {doctor.clinics[0].clinic_address.city}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Section - Fee and Actions */}
                                    <div className="text-right">
                                        {/* Consultation Fee */}
                                        <div className="mb-4">
                                            <div className="text-sm text-gray-500">Consultation Fee</div>
                                            <div className="text-lg font-semibold text-gray-800">₹{doctor.consultation_fee}</div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2">
                                            <Link
                                                to={`/book-appointment/${doctor.id}`}
                                                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                                            >
                                                Book Appointment
                                            </Link>
                                            {doctor.clinics && doctor.clinics[0]?.clinic_info?.clinic_phone && (
                                                <a
                                                    href={`tel:${doctor.clinics[0].clinic_info.clinic_phone}`}
                                                    className="bg-gray-100 text-gray-600 p-2 rounded-lg hover:bg-gray-200 transition flex items-center justify-center"
                                                    title="Call Clinic"
                                                >
                                                    <Phone size={20} />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="text-blue-600" size={24} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Doctors Available</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                        There are currently no doctors registered in the system. Please check back later.
                    </p>
                </div>
            )}
        </div>
    );
}


export default DoctorsListForPatient;