import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, MapPin, Calendar, Activity, Droplet, Ruler, Weight, AlertTriangle, Heart, Phone as PhoneIcon } from 'lucide-react';
// import { useParams, useLocation } from 'react-router-dom';
import loadToken from '../security';


const PatientProfile = () => {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('personal');


    const fetchData = async (accessToken) => {
        try {
            const response = await fetch("http://localhost:8000/users/user-profile", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error while calling User Profile api http://localhost:8000/users/user-profile');
            }

            const data = await response.json();
            console.log("login data after response.json", data);
            return data;

        } catch (error) {
            throw error;
        }
    }

    useEffect(() => {
        console.log("inside useEffect!!");
        const token = loadToken();
        if (!token) {
            return;
        }

        fetchData(token)
            .then(responseData => {
                setProfileData(responseData);
                setLoading(false);
            })
            .catch(error => {
                console.error(error);
                setError(error.message || "Error loading profile");
                setLoading(false);
            });

    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-8 bg-red-50 rounded-lg">
                <h3 className="text-red-500 text-xl font-semibold">{error}</h3>
                <button
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    onClick={() => window.location.reload()}
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (!profileData) return null;

    const { patient, ...user } = profileData;
    console.log("profile data", profileData);
    console.log("Logging patient and user", patient, user);

    const getGenderIcon = (gender) => {
        if (gender === 'MALE') return '♂️';
        if (gender === 'FEMALE') return '♀️';
        return '⚧️';
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Profile Header */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-32"></div>
                <div className="relative px-6 pb-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center">
                        <div className="absolute -top-16 bg-white p-2 rounded-full shadow-lg">
                            <div className="flex items-center justify-center w-32 h-32 bg-blue-100 rounded-full">
                                <User className="text-blue-600" size={64} />
                            </div>
                        </div>
                        <div className="mt-20 md:mt-4 md:ml-40">
                            <h1 className="text-2xl font-bold text-gray-800">
                                {user.first_name} {user.last_name}
                            </h1>
                            <div className="flex items-center text-gray-600 mt-1">
                                <span className="mr-2 text-lg">{getGenderIcon(user.gender)}</span>
                                <span>{user.gender}</span>
                                <span className="mx-2">•</span>
                                <span>{user.age} years</span>
                            </div>
                        </div>
                        <div className="mt-4 md:mt-0 md:ml-auto">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition">
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 mb-6">
                <button
                    className={`py-3 px-6 font-medium text-sm ${activeTab === 'personal' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
                        }`}
                    onClick={() => setActiveTab('personal')}
                >
                    Personal Information
                </button>
                <button
                    className={`py-3 px-6 font-medium text-sm ${activeTab === 'medical' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
                        }`}
                    onClick={() => setActiveTab('medical')}
                >
                    Medical Details
                </button>
                <button
                    className={`py-3 px-6 font-medium text-sm ${activeTab === 'emergency' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
                        }`}
                    onClick={() => setActiveTab('emergency')}
                >
                    Emergency Contact
                </button>
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Sidebar - Quick Info */}
                <div className="md:col-span-1">
                    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h2>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <Phone className="text-blue-500 mr-3 mt-1 flex-shrink-0" size={20} />
                                <div>
                                    <p className="text-sm text-gray-500">Phone</p>
                                    <p className="text-gray-800">{user.mobile_no}</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <Mail className="text-blue-500 mr-3 mt-1 flex-shrink-0" size={20} />
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="text-gray-800">{user.gmail}</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <MapPin className="text-blue-500 mr-3 mt-1 flex-shrink-0" size={20} />
                                <div>
                                    <p className="text-sm text-gray-500">Address</p>
                                    <p className="text-gray-800">Address details will appear here if available</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {patient && (
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Health Info</h2>
                            <div className="space-y-4">
                                {patient.blood_group && (
                                    <div className="flex items-start">
                                        <Droplet className="text-red-500 mr-3 mt-1 flex-shrink-0" size={20} />
                                        <div>
                                            <p className="text-sm text-gray-500">Blood Group</p>
                                            <p className="text-gray-800">{patient.blood_group}</p>
                                        </div>
                                    </div>
                                )}
                                {(patient.height || patient.weight) && (
                                    <div className="flex items-start">
                                        <Activity className="text-green-500 mr-3 mt-1 flex-shrink-0" size={20} />
                                        <div>
                                            <p className="text-sm text-gray-500">Body Metrics</p>
                                            <p className="text-gray-800">
                                                {patient.height && `${patient.height} cm`}{patient.height && patient.weight && ' • '}
                                                {patient.weight && `${patient.weight} kg`}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {patient.allergies && (
                                    <div className="flex items-start">
                                        <AlertTriangle className="text-yellow-500 mr-3 mt-1 flex-shrink-0" size={20} />
                                        <div>
                                            <p className="text-sm text-gray-500">Allergies</p>
                                            <p className="text-gray-800">{patient.allergies}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Main Content */}
                <div className="md:col-span-2">
                    {activeTab === 'personal' && (
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-6">Personal Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">First Name</label>
                                    <p className="text-gray-800 font-medium">{user.first_name}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Last Name</label>
                                    <p className="text-gray-800 font-medium">{user.last_name}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Age</label>
                                    <p className="text-gray-800 font-medium">{user.age} years</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Gender</label>
                                    <p className="text-gray-800 font-medium">{user.gender}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                                    <p className="text-gray-800 font-medium">{user.mobile_no}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                                    <p className="text-gray-800 font-medium">{user.gmail}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'medical' && patient && (
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-6">Medical Details</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Blood Group</label>
                                    <p className="text-gray-800 font-medium">{patient.blood_group || 'Not provided'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Height</label>
                                    <p className="text-gray-800 font-medium">{patient.height ? `${patient.height} cm` : 'Not provided'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Weight</label>
                                    <p className="text-gray-800 font-medium">{patient.weight ? `${patient.weight} kg` : 'Not provided'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Allergies</label>
                                    <p className="text-gray-800 font-medium">{patient.allergies || 'None reported'}</p>
                                </div>
                            </div>

                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Medical History</h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                {patient.medical_history ? (
                                    <p className="text-gray-800 whitespace-pre-line">{patient.medical_history}</p>
                                ) : (
                                    <p className="text-gray-500 italic">No medical history recorded</p>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'emergency' && patient && (
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-6">Emergency Contact</h2>

                            {patient.emergency_contact_name && patient.emergency_contact_number ? (
                                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                                    <div className="flex items-center mb-4">
                                        <Heart className="text-red-500 mr-3" size={24} />
                                        <h3 className="text-lg font-semibold text-gray-800">Emergency Contact Information</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Contact Name</label>
                                            <p className="text-gray-800 font-medium">{patient.emergency_contact_name}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Contact Number</label>
                                            <div className="flex items-center">
                                                <p className="text-gray-800 font-medium">{patient.emergency_contact_number}</p>
                                                <button className="ml-2 bg-green-500 hover:bg-green-600 text-white p-2 rounded-full">
                                                    <PhoneIcon size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                                    <AlertTriangle className="text-yellow-500 mx-auto mb-2" size={32} />
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No Emergency Contact Set</h3>
                                    <p className="text-gray-600 mb-4">Please add an emergency contact for your safety.</p>
                                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition">
                                        Add Emergency Contact
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientProfile;