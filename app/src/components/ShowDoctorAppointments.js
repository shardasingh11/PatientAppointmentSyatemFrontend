import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Phone, User, AlertCircle, CheckCircle, XCircle, FileText, CreditCard, Clipboard } from 'lucide-react';

const ShowDoctorAppointments = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { token, isLoading: isAuthLoading } = useAuth();
    const [activeTab, setActiveTab] = useState('all');
    const [doctorName, setDoctorName] = useState('');
    const [speciality, setSpeciality] = useState('');

    // Function to fetch the appointments
    const fetchAppointments = async () => {
        try {
            const response = await fetch("http://localhost:8000/appointment/doctor-appointments", {
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
            return [];
        }
    };

    useEffect(() => {

        if (isAuthLoading) {
            return; // Wait for authentication loading to finish}
        }

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
                if (response) {
                    setAppointments(response);
                    console.log("Doctor appointments", response);
                    
                    // Extract doctor information from the first appointment
                    if (response && response.length > 0 && response[0].doctor && response[0].doctor.user) {
                        const firstName = response[0].doctor.user.first_name || '';
                        const lastName = response[0].doctor.user.last_name || '';
                        setDoctorName(`Dr. ${firstName} ${lastName}`);
                        setSpeciality(response[0].doctor.speciality || '');
                    }
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

    // Handle no appointments case
    if (!appointments || appointments.length === 0) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="text-blue-600" size={24} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Appointments Found</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                        You don't have any appointments at the moment.
                    </p>
                    <Link
                        to="/doctor-dashboard"
                        className="mt-4 inline-flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    // Filter appointments based on active tab
    console.log("logging the appointments", appointments);
    console.log("logging the active tab", activeTab);
    const filteredAppointments = appointments.filter(appointment => {
        if (activeTab === 'all') return true;
        if (activeTab === 'upcoming') return appointment.appointment_status === 'scheduled';
        if (activeTab === 'completed') return appointment.appointment_status === 'completed';
        if (activeTab === 'cancelled') return appointment.appointment_status === 'cancelled';
        if (activeTab === 'inprogress') return appointment.appointment_status === 'inprogress';
        return true;
    });

    // Sort appointments by date and time (most recent first)
    filteredAppointments.sort((a, b) => {
        const dateComparison = new Date(b.date) - new Date(a.date);
        if (dateComparison !== 0) return dateComparison;
        return a.start_time.localeCompare(b.start_time);
    });

    // Group appointments by date
    const groupedAppointments = filteredAppointments.reduce((groups, appointment) => {
        const date = appointment.date;
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(appointment);
        return groups;
    }, {});

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

    // Check if a date is today
    const isToday = (dateString) => {
        const today = new Date();
        const appointmentDate = new Date(dateString);
        return today.toDateString() === appointmentDate.toDateString();
    };

    // Check if a date is tomorrow
    const isTomorrow = (dateString) => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const appointmentDate = new Date(dateString);
        return tomorrow.toDateString() === appointmentDate.toDateString();
    };

    // Get friendly date label
    const getDateLabel = (dateString) => {
        if (isToday(dateString)) {
            return "Today";
        } else if (isTomorrow(dateString)) {
            return "Tomorrow";
        } else {
            return formatDate(dateString);
        }
    };

    // Get status badge based on appointment status
    const getStatusBadge = (status) => {
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
            case 'inprogress':
                return (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center">
                        <AlertCircle size={12} className="mr-1" /> In Progress
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
            case 'completed':
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
                {doctorName && (
                    <div>
                        <h2 className="text-xl text-gray-700 mb-1">{doctorName}</h2>
                        {speciality && <p className="text-md text-gray-600 mb-2">{speciality}</p>}
                    </div>
                )}
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Manage your patient appointments and schedule
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
                        onClick={() => setActiveTab('inprogress')}
                        className={`px-5 py-2 rounded-md font-medium text-sm transition-all ${
                            activeTab === 'inprogress'
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        In Progress
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

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
                    <h3 className="text-gray-500 text-sm">Today's Appointments</h3>
                    <p className="text-2xl font-bold text-gray-800">
                        {appointments.filter(a => isToday(a.date)).length}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
                    <h3 className="text-gray-500 text-sm">Completed</h3>
                    <p className="text-2xl font-bold text-gray-800">
                        {appointments.filter(a => a.appointment_status === 'completed').length}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-yellow-500">
                    <h3 className="text-gray-500 text-sm">Upcoming</h3>
                    <p className="text-2xl font-bold text-gray-800">
                        {appointments.filter(a => a.appointment_status === 'scheduled').length}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-red-500">
                    <h3 className="text-gray-500 text-sm">Cancelled</h3>
                    <p className="text-2xl font-bold text-gray-800">
                        {appointments.filter(a => a.appointment_status === 'cancelled').length}
                    </p>
                </div>
            </div>

            {/* Appointments List Grouped by Date */}
            {filteredAppointments.length > 0 ? (
                <div className="space-y-8">
                    {Object.keys(groupedAppointments).map((date) => (
                        <div key={date} className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                <Calendar className="mr-2 text-blue-600" size={20} />
                                {getDateLabel(date)}
                                {isToday(date) && (
                                    <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                        Today
                                    </span>
                                )}
                            </h2>
                            
                            <div className="space-y-4">
                                {groupedAppointments[date].map((appointment) => (
                                    <div key={appointment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                        <div className="p-6">
                                            <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                                                {/* Left Section - Patient & Appointment Info */}
                                                <div className="flex gap-4 mb-4 md:mb-0">
                                                    {/* Patient Avatar */}
                                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <User className="text-blue-600" size={24} />
                                                    </div>

                                                    {/* Patient & Appointment Details */}
                                                    <div className="flex-1">
                                                        {/* Patient Name and Status */}
                                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                                                            <h2 className="text-xl font-semibold text-gray-800">
                                                                {appointment.patient.user.first_name} {appointment.patient.user.last_name}
                                                            </h2>
                                                            <div className="flex gap-2">
                                                                {getStatusBadge(appointment.appointment_status)}
                                                                {getPaymentBadge(appointment.payment_status)}
                                                            </div>
                                                        </div>

                                                        {/* Patient Email */}
                                                        <p className="text-gray-600 mb-2">{appointment.patient.user.gmail}</p>

                                                        {/* Appointment Time */}
                                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600 mb-3">
                                                            <div className="flex items-center">
                                                                <Clock size={16} className="mr-1 text-gray-400" />
                                                                <span>{formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}</span>
                                                            </div>
                                                        </div>

                                                        {/* Clinic Info */}
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
                                                        {appointment.appointment_status === 'scheduled' && (
                                                            <>
                                                                <Link
                                                                    to={`/start-appointment/${appointment.id}`}
                                                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition text-sm"
                                                                >
                                                                    Start Appointment
                                                                </Link>
                                                                <Link
                                                                    to={`/reschedule-doctor-appointment/${appointment.id}`}
                                                                    className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition text-sm"
                                                                >
                                                                    Reschedule
                                                                </Link>
                                                            </>
                                                        )}
                                                        {appointment.appointment_status === 'inprogress' && (
                                                            <Link
                                                                to={`/continue-appointment/${appointment.id}`}
                                                                className="bg-yellow-50 text-yellow-600 border border-yellow-200 px-4 py-2 rounded-lg font-medium hover:bg-yellow-100 transition text-sm flex items-center"
                                                            >
                                                                <Clipboard size={16} className="mr-2" />
                                                                Continue Session
                                                            </Link>
                                                        )}
                                                        {appointment.appointment_status === 'completed' && (
                                                            <Link
                                                                to={`/view-medical-record/${appointment.id}`}
                                                                className="bg-green-50 text-green-600 border border-green-200 px-4 py-2 rounded-lg font-medium hover:bg-green-100 transition text-sm flex items-center"
                                                            >
                                                                <FileText size={16} className="mr-2" />
                                                                View Records
                                                            </Link>
                                                        )}
                                                        {appointment.appointment_status === 'cancelled' && (
                                                            <div className="text-sm text-gray-500 italic">
                                                                Appointment was cancelled
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="text-blue-600" size={24} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No {activeTab !== 'all' ? activeTab : ''} Appointments Found</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                        You don't have any {activeTab !== 'all' ? activeTab : ''} appointments at the moment.
                    </p>
                    <Link
                        to="/"
                        className="mt-4 inline-flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                    >
                        Back to Home
                    </Link>
                </div>
            )}
        </div>
    );
};

export default ShowDoctorAppointments;