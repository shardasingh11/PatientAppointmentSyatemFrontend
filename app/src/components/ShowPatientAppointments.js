import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Phone, User, AlertCircle, CheckCircle, XCircle, FileText, CreditCard } from 'lucide-react';

const ShowPatientAppointments = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();
    const [activeTab, setActiveTab] = useState('all');
    const [patientName, setPatientName] = useState('');

    // Function to fetch the appointments
    const fetchAppointments = async () => {
        try {
            const response = await fetch("http://localhost:8000/appointment/all-patient-appointment", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to fetch appointments');
            }

            const data = await response.json();
            return data;
        } catch (err) {
            setError("Failed to fetch appointments. Please try again later!");
            console.error(err);
        }
    };

    useEffect(() => {
        if (!token) {
            setLoading(true);
            setTimeout(() => {
                navigate(`/login-page`);
            }, 1000);
            return;
        }
        
        fetchAppointments()
            .then((response) => {
                setLoading(false);
                setAppointments(response);
                console.log("Patient appointments", response);
                
                // Extract patient name from the first appointment
                if (response && response.length > 0 && response[0].patient && response[0].patient.user) {
                    const firstName = response[0].patient.user.first_name || '';
                    const lastName = response[0].patient.user.last_name || '';
                    setPatientName(`${firstName} ${lastName}`);
                }
            });
    }, [token, navigate]);

    // Handle Loading state
    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8 flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                    <p className="mt-4 text-gray-600">Loading your appointments...</p>
                </div>
            </div>
        );
    }

    // Handle Error state
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

    // Filter appointments based on active tab
    const filteredAppointments = appointments && appointments.length > 0 
        ? appointments.filter(appointment => {
            if (activeTab === 'all') return true;
            if (activeTab === 'upcoming') return appointment.appointment_status === 'scheduled';
            if (activeTab === 'completed') return appointment.appointment_status === 'completed';
            if (activeTab === 'cancelled') return appointment.appointment_status === 'cancelled';
            return true;
        })
        : [];

    // Format date to a more readable format
    const formatDate = (dateString) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Format time to 12-hour format
    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };

    // Get status badge based on appointment status
    const getStatusBadge = (status, paymentStatus) => {
        switch (status) {
            case 'scheduled':
                return (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
                        <Clock size={12} className="mr-1" /> Upcoming
                    </span>
                );
            case 'completed':
                return (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                        <CheckCircle size={12} className="mr-1" /> Completed
                    </span>
                );
            case 'cancelled':
                return (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full flex items-center">
                        <XCircle size={12} className="mr-1" /> Cancelled
                    </span>
                );
            default:
                return (
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full flex items-center">
                        <AlertCircle size={12} className="mr-1" /> {status}
                    </span>
                );
        }
    };

    // Get payment status badge
    const getPaymentBadge = (paymentStatus) => {
        switch (paymentStatus) {
            case 'paid':
                return (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                        <CheckCircle size={12} className="mr-1" /> Paid
                    </span>
                );
            case 'pending':
                return (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center">
                        <AlertCircle size={12} className="mr-1" /> Payment Pending
                    </span>
                );
            case 'failed':
                return (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full flex items-center">
                        <XCircle size={12} className="mr-1" /> Payment Failed
                    </span>
                );
            default:
                return (
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full flex items-center">
                        <CreditCard size={12} className="mr-1" /> {paymentStatus}
                    </span>
                );
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 bg-gray-50">
            {/* Header */}
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-blue-800 mb-2">Your Appointments</h1>
                {patientName && (
                    <h2 className="text-xl text-gray-700 mb-2">Patient: {patientName}</h2>
                )}
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Track and manage all your medical appointments in one place
                </p>
            </div>

            {/* Filter Tabs */}
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
                        All Appointments
                    </button>
                    <button
                        onClick={() => setActiveTab('upcoming')}
                        className={`px-5 py-2 rounded-md font-medium text-sm transition-all ${
                            activeTab === 'upcoming'
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        Upcoming
                    </button>
                    <button
                        onClick={() => setActiveTab('completed')}
                        className={`px-5 py-2 rounded-md font-medium text-sm transition-all ${
                            activeTab === 'completed'
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        Completed
                    </button>
                    <button
                        onClick={() => setActiveTab('cancelled')}
                        className={`px-5 py-2 rounded-md font-medium text-sm transition-all ${
                            activeTab === 'cancelled'
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        Cancelled
                    </button>
                </div>
            </div>

            {/* Appointments List */}
            {filteredAppointments && filteredAppointments.length > 0 ? (
                <div className="space-y-4">
                    {filteredAppointments.map((appointment) => (
                        <div key={appointment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                                    {/* Left Section - Doctor & Appointment Info */}
                                    <div className="flex gap-4 mb-4 md:mb-0">
                                        {/* Doctor Avatar */}
                                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <User className="text-blue-600" size={24} />
                                        </div>

                                        {/* Doctor & Appointment Details */}
                                        <div className="flex-1">
                                            {/* Doctor Name and Status */}
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                                                <h2 className="text-xl font-semibold text-gray-800">
                                                    Dr. {appointment.doctor.user.first_name} {appointment.doctor.user.last_name}
                                                </h2>
                                                <div className="flex gap-2">
                                                    {getStatusBadge(appointment.appointment_status)}
                                                    {getPaymentBadge(appointment.payment_status)}
                                                </div>
                                            </div>

                                            {/* Speciality */}
                                            <p className="text-gray-600 mb-2">{appointment.doctor.speciality}</p>

                                            {/* Patient Name (Added this) */}
                                            <p className="text-gray-600 mb-2">
                                                <span className="font-medium">Patient:</span> {appointment.patient.user.first_name} {appointment.patient.user.last_name}
                                            </p>

                                            {/* Clinic Info */}
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600 mb-3">
                                                <div className="flex items-center">
                                                    <Calendar size={16} className="mr-1 text-gray-400" />
                                                    <span>{formatDate(appointment.date)}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <Clock size={16} className="mr-1 text-gray-400" />
                                                    <span>{formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}</span>
                                                </div>
                                            </div>

                                            {/* Location Info */}
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                                {/* Clinic Name */}
                                                <div className="flex items-center">
                                                    <MapPin size={16} className="mr-1 text-gray-400" />
                                                    <span>{appointment.clinic.clinic_name}</span>
                                                </div>
                                                
                                                {/* Clinic Address */}
                                                <div className="flex items-center">
                                                    <span>
                                                        {appointment.clinic.address.area_name}, {appointment.clinic.address.city}
                                                    </span>
                                                </div>
                                                
                                                {/* Clinic Phone */}
                                                {appointment.clinic.clinic_phone && (
                                                    <div className="flex items-center">
                                                        <Phone size={16} className="mr-1 text-gray-400" />
                                                        <span>{appointment.clinic.clinic_phone}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Section - Fee and Actions */}
                                    <div className="text-right flex flex-col items-end">
                                        {/* Consultation Fee */}
                                        <div className="mb-4">
                                            <div className="text-sm text-gray-500">Consultation Fee</div>
                                            <div className="text-lg font-semibold text-gray-800">₹{appointment.fees}</div>
                                        </div>

                                        {/* Reason for Visit */}
                                        <div className="mb-4 text-right">
                                            <div className="text-sm text-gray-500">Reason for Visit</div>
                                            <div className="text-sm text-gray-800">{appointment.reason_for_visit}</div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2">
                                            {appointment.appointment_status === 'SCHEDULED' && (
                                                <>
                                                    <Link
                                                        to={`/reschedule-appointment/${appointment.id}`}
                                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition text-sm"
                                                    >
                                                        Reschedule
                                                    </Link>
                                                    <Link
                                                        to={`/cancel-appointment/${appointment.id}`}
                                                        className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition text-sm"
                                                    >
                                                        Cancel
                                                    </Link>
                                                </>
                                            )}
                                            {appointment.appointment_status === 'COMPLETED' && (
                                                <Link
                                                    to={`/medical-records/${appointment.id}`}
                                                    className="bg-green-50 text-green-600 border border-green-200 px-4 py-2 rounded-lg font-medium hover:bg-green-100 transition text-sm flex items-center"
                                                >
                                                    <FileText size={16} className="mr-2" />
                                                    View Records
                                                </Link>
                                            )}
                                            {appointment.appointment_status === 'CANCELLED' && (
                                                <Link
                                                    to={`/book-appointment/${appointment.doctor.id}`}
                                                    className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition text-sm"
                                                >
                                                    Book Again
                                                </Link>
                                            )}
                                            {appointment.payment_status === 'PENDING' && (
                                                <Link
                                                    to={`/complete-payment/${appointment.id}`}
                                                    className="bg-yellow-50 text-yellow-600 border border-yellow-200 px-4 py-2 rounded-lg font-medium hover:bg-yellow-100 transition text-sm flex items-center"
                                                >
                                                    <CreditCard size={16} className="mr-2" />
                                                    Pay Now
                                                </Link>
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
                        <Calendar className="text-blue-600" size={24} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Appointments Found</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                        You don't have any {activeTab !== 'all' ? activeTab : ''} appointments at the moment.
                    </p>
                    <Link
                        to="/find-doctors"
                        className="mt-4 inline-flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                    >
                        Find a Doctor
                    </Link>
                </div>
            )}
        </div>
    );
};

export default ShowPatientAppointments;