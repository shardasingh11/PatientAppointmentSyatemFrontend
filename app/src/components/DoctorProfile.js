import React, { useState, useEffect } from 'react';
import {
    User,
    Phone,
    MapPin,
    Award,
    Clock,
    Briefcase,
    GraduationCap,
    Building,
    Calendar,
    Shield,
    CheckCircle
} from 'lucide-react';
import { useParams } from 'react-router-dom';

const DoctorProfile = () => {
    const { doctorId } = useParams()
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [verifying, setVerifying] = useState(false);

    useEffect(() => {
        fetchDoctorProfile();
    }, [doctorId]);

    const fetchDoctorProfile = async () => {
        try {
            setLoading(true);
            // Replace with your actual API endpoint
            const response = await fetch(`http://localhost:8000/doctor/doctor-profile/${doctorId}`);

            if (!response.ok) {
                throw new Error('Failed to fetch doctor profile');
            }

            const data = await response.json();
            console.log("logging response data",data);
            console.log("logging user", data.user);
            console.log("logging user name", data.user.name);
            setDoctor(data);
            setError(null);
        } catch (err) {
            setError('Error loading doctor profile. Please try again later.');
            console.error('Error fetching doctor profile:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyDoctor = async () => {
        try {
            setVerifying(true);
            // Replace with your actual verification API endpoint
            const response = await fetch(`/api/doctors/${doctorId}/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to verify doctor');
            }

            // Update the local state to reflect verification
            setDoctor(prevDoctor => ({
                ...prevDoctor,
                is_verified: true
            }));

        } catch (err) {
            setError('Error verifying doctor. Please try again later.');
            console.error('Error verifying doctor:', err);
        } finally {
            setVerifying(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8 flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
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

    if (!doctor) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-800">Doctor not found</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Header with Doctor Basic Info */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                    <div className="flex flex-col md:flex-row items-start md:items-center">
                        <div className="bg-blue-100 rounded-full w-24 h-24 flex items-center justify-center mr-6 mb-4 md:mb-0">
                            <User className="text-blue-600" size={48} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-1">Dr. {doctor?.user?.name}</h1>
                            <p className="text-xl text-blue-600 mb-2">{doctor?.speciality}</p>
                            <div className="flex items-center">
                                <Briefcase className="text-gray-500 mr-2" size={16} />
                                <span className="text-gray-600">{doctor?.experience} years of experience</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 md:mt-0">
                        {!doctor?.is_verified && (
                            <button
                                onClick={handleVerifyDoctor}
                                disabled={verifying}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow transition duration-300 flex items-center"
                            >
                                {verifying ? (
                                    <>
                                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Verifying...
                                    </>
                                ) : (
                                    <>
                                        <Shield className="mr-2" size={18} />
                                        Verify Doctor
                                    </>
                                )}
                            </button>
                        )}

                        {doctor?.is_verified && (
                            <div className="flex items-center text-green-600">
                                <CheckCircle className="mr-2" size={20} />
                                <span className="font-semibold">Verified Doctor</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Bio and Qualifications */}
                <div className="lg:col-span-2">
                    {/* Bio Section */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">About Doctor</h2>
                        <p className="text-gray-600 whitespace-pre-line">{doctor?.bio}</p>
                    </div>

                    {/* Qualifications Section */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Qualifications</h2>
                        {doctor?.qualifications.length === 0 ? (
                            <p className="text-gray-500">No qualifications listed</p>
                        ) : (
                            <div className="space-y-6">
                                {doctor?.qualifications.map((qualification) => (
                                    <div key={qualification.id} className="border-l-4 border-blue-600 pl-4">
                                        <div className="flex items-start">
                                            <GraduationCap className="text-blue-600 mr-3 mt-1 flex-shrink-0" size={20} />
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800">
                                                    {qualification?.qualification_name}
                                                </h3>
                                                <p className="text-gray-600">
                                                    <Building className="inline mr-1" size={14} />
                                                    {qualification?.institute?.name} ({qualification?.institute?.type})
                                                </p>
                                                <p className="text-gray-600">
                                                    <Calendar className="inline mr-1" size={14} />
                                                    Completed in {qualification?.year_completed}
                                                    {qualification?.course_duration &&
                                                        ` • ${qualification?.course_duration} duration`
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column - Consultation Info and Clinics */}
                <div className="lg:col-span-1">
                    {/* Consultation Info Card */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Consultation Info</h2>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <Award className="text-green-600 mr-3 mt-1 flex-shrink-0" size={20} />
                                <div>
                                    <h3 className="text-md font-semibold text-gray-700">Speciality</h3>
                                    <p className="text-gray-600">{doctor?.speciality}</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <Clock className="text-blue-600 mr-3 mt-1 flex-shrink-0" size={20} />
                                <div>
                                    <h3 className="text-md font-semibold text-gray-700">Experience</h3>
                                    <p className="text-gray-600">{doctor?.experience} years</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <Award className="text-purple-600 mr-3 mt-1 flex-shrink-0" size={20} />
                                <div>
                                    <h3 className="text-md font-semibold text-gray-700">Consultation Fee</h3>
                                    <p className="text-gray-600">₹{doctor?.consultation_fee}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Clinics Section */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Practice Locations</h2>
                        {doctor?.clinics.length === 0 ? (
                            <p className="text-gray-500">No clinics listed</p>
                        ) : (
                            <div className="space-y-6">
                                {doctor?.clinics.map((clinic) => (
                                    <div key={clinic.clinic_info.id} className="border-l-4 border-green-600 pl-4">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                            {clinic.clinic_info.clinic_name}
                                            {clinic.clinic_info.is_primary_location && (
                                                <span className="ml-2 bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                                                    Primary
                                                </span>
                                            )}
                                        </h3>
                                        <div className="space-y-2">
                                            <div className="flex items-start">
                                                <Phone className="text-gray-500 mr-2 mt-1 flex-shrink-0" size={16} />
                                                <p className="text-gray-600">{clinic.clinic_info.clinic_phone}</p>
                                            </div>
                                            <div className="flex items-start">
                                                <MapPin className="text-gray-500 mr-2 mt-1 flex-shrink-0" size={16} />
                                                <div className="text-gray-600">
                                                    <p>{clinic.clinic_address.street_address}</p>
                                                    <p>{clinic.clinic_address.area_name}, {clinic.clinic_address.city}</p>
                                                    <p>{clinic.clinic_address.state} - {clinic.clinic_address.pincode}</p>
                                                    <p>{clinic.clinic_address.country}</p>
                                                </div>
                                            </div>
                                            {clinic.clinic_info.consultation_hours_notes && (
                                                <div className="flex items-start mt-2">
                                                    <Clock className="text-gray-500 mr-2 mt-1 flex-shrink-0" size={16} />
                                                    <p className="text-gray-600">{clinic.clinic_info.consultation_hours_notes}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorProfile;