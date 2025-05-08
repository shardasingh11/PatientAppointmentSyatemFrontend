import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { User, Award, Clock, MapPin, Phone, Calendar, Check, X } from 'lucide-react';




const DoctorsListForPatient = () => {

    const [doctors, setDoctors] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();
    const [activeTab, setActiveTab] = useState('all');



    // Function to Fetch the Doctors
    const fetchDoctorsList = async () => {
        try{
            const response = await fetch("http://localhost:8000/patient/doctors-list",{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`

                }
            });

            if(!response.ok){
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to Fetch Doctors List');
              }

            const data = await response.json()
            return data;


        }catch(err){
            setError("Failed to fetch doctors list. try again later!")
            console.error(err);
        }
    } 

    useEffect(() => {
        if(token){
            fetchDoctorsList()
                .then((response) => {
                    setLoading(false);
                    setDoctors(response);
                    console.log("Doctors List for patients", response);
                })
        }

    },[token]);

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
    if(error){
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
                            className={`px-5 py-2 rounded-md font-medium text-sm transition-all ${
                                activeTab === 'all' 
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
                                className={`px-5 py-2 rounded-md font-medium text-sm transition-all ${
                                    activeTab === specialty 
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredDoctors.map((doctor) => (
                        
                        <div key={doctor.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100">
                            <div className="p-6">
                                {/* Header with Doctor Profile */}
                                <div className="flex items-start mb-5">
                                    <div className="flex-shrink-0">
                                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                            <User className="text-blue-600" size={28} />
                                        </div>
                                    </div>
                                    
                                    <div className="ml-4 flex-1">
                                        <div className="flex items-center">
                                            <h3 className="text-xl font-bold text-gray-800">{doctor.user?.name}</h3>
                                            {doctor.is_verified ? (
                                                <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                                                    <Check size={12} className="mr-1" /> Verified
                                                </span>
                                            ):(
                                                <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full inline-flex items-center whitespace-nowrap">
                                                    <X size={12} className="mr-1" /> Not Verified
                                                </span>
                                            )}
                                        </div>
                                        
                                        <div className="flex items-center mt-1">
                                            <span className="text-blue-600 font-medium">{doctor.speciality}</span>
                                            <span className="mx-2 text-gray-300">•</span>
                                            <span className="text-gray-600 flex items-center">
                                                <Clock size={14} className="mr-1" /> {doctor.experience} yrs exp
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Highlights Row */}
                                <div className="grid grid-cols-2 gap-4 mb-5">
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                        <div className="text-xs text-blue-800 font-medium mb-1">Consultation Fee</div>
                                        <div className="font-bold text-gray-800">₹{doctor.consultation_fee}</div>
                                    </div>
                                    
                                    <div className="bg-green-50 p-3 rounded-lg">
                                        <div className="text-xs text-green-800 font-medium mb-1">Clinic</div>
                                        <div className="font-bold text-gray-800 truncate">
                                            {doctor.clinics && doctor.clinics[0]?.clinic_info?.clinic_name || "Not Available"}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Bio - with Read More Toggle */}
                                {doctor.bio && (
                                    <div className="mb-5">
                                        <p className="text-gray-600 text-sm line-clamp-3">{doctor.bio}</p>
                                        <button className="text-blue-600 text-sm font-medium mt-1 hover:text-blue-800">
                                            Read more
                                        </button>
                                    </div>
                                )}
                                
                                {/* Details Section */}
                                <div className="mb-5 space-y-3">
                                    {/* Qualifications */}
                                    {doctor.qualifications && doctor.qualifications.length > 0 && (
                                        <div className="flex">
                                            <Award className="text-blue-600 w-5 h-5 flex-shrink-0 mt-1" />
                                            <div className="ml-3">
                                                <div className="text-sm font-medium text-gray-700">Qualifications</div>
                                                <div className="text-sm text-gray-600">
                                                    {doctor.qualifications.map((qual, idx) => (
                                                        <span key={idx} className="block">{qual.qualification_name}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Phone Number - Added prominently */}
                                    {doctor.clinics && doctor.clinics.length > 0 && doctor.clinics[0].clinic_info?.clinic_phone && (
                                        <div className="flex">
                                            <Phone className="text-blue-600 w-5 h-5 flex-shrink-0 mt-1" />
                                            <div className="ml-3">
                                                <div className="text-sm font-medium text-gray-700">Contact Number</div>
                                                <div className="text-sm text-gray-600 font-medium">
                                                    {doctor.clinics[0].clinic_info.clinic_phone}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Location */}
                                    {doctor.clinics && doctor.clinics.length > 0 && doctor.clinics[0].clinic_address && (
                                        <div className="flex">
                                            <MapPin className="text-blue-600 w-5 h-5 flex-shrink-0 mt-1" />
                                            <div className="ml-3">
                                                <div className="text-sm font-medium text-gray-700">Location</div>
                                                <div className="text-sm text-gray-600">
                                                    {doctor.clinics[0].clinic_address.area_name}, {doctor.clinics[0].clinic_address.city}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Available Hours - Condensed */}
                                    {doctor.clinics && doctor.clinics.length > 0 && doctor.clinics[0].clinic_info?.consultation_hours_notes && (
                                        <div className="flex">
                                            <Calendar className="text-blue-600 w-5 h-5 flex-shrink-0 mt-1" />
                                            <div className="ml-3">
                                                <div className="text-sm font-medium text-gray-700">Availability</div>
                                                <div className="text-xs text-gray-600 line-clamp-2">
                                                    {doctor.clinics[0].clinic_info.consultation_hours_notes}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Action Footer */}
                            <div className="px-6 pb-6">
                                <div className="flex space-x-3">
                                    <button className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition shadow-sm">
                                        Book Appointment
                                    </button>
                                    {doctor.clinics && doctor.clinics.length > 0 && doctor.clinics[0].clinic_info?.clinic_phone && (
                                        <a href={`tel:${doctor.clinics[0].clinic_info.clinic_phone}`} className="bg-gray-100 text-gray-600 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition flex items-center justify-center">
                                            <Phone size={18} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="text-blue-600" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No Doctors Available</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                        There are currently no doctors registered in the system. Please check back later.
                    </p>
                </div>
            )}
        </div>
    );


}

export default DoctorsListForPatient;