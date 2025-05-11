import { useState, useEffect} from "react";
import { useAuth } from "../context/AuthContext";
import { Calendar, Clock, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { useNavigate, useParams } from "react-router-dom";

const BookAppointment = () => {
    const navigate = useNavigate();
    const { token, isLoading: isAuthLoading } = useAuth();
    const { doctorId } = useParams(); // Assuming doctor_id is passed as URL param
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [doctorSlots, setDoctorSlots] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Calculate 30 days from today
    const today = new Date();
    const maxDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    useEffect(() => {
        if(isAuthLoading) return;
        if (!token) {
            setLoading(true);
            setTimeout(()=>{
                navigate('/login-page');
            }, 2000);
           
            return;
        }
        if (doctorId) {
            fetchDoctorSlots();
        }
    }, [token, doctorId, isAuthLoading]);

    // Fetch doctor's available slots
    const fetchDoctorSlots = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8000/appointment/select-appointment-slot/${doctorId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to fetch available slots');
            }

            const data = await response.json();
            setDoctorSlots(data);
            setLoading(false);
        } catch (err) {
            setError(err.message || "Failed to fetch available slots. Please try again later.");
            setLoading(false);
            console.error(err);
        }
    };
   

    // Helper function to parse date string from API format (YY-MM-DD)
    const parseApiDate = (dateStr) => {
        const parts = dateStr.split('-');
        const year = parseInt('20' + parts[0]); // Convert 25 to 2025
        const month = parseInt(parts[1]) - 1; // Month is 0-indexed
        const day = parseInt(parts[2]);
        return new Date(year, month, day);
    };

    // Get slots for a specific date
    const getSlotsForDate = (date) => {
        if (!doctorSlots) return [];
        
        const dateString = date.toISOString().split('T')[0];
        const formattedDate = `${dateString.slice(2).replace(/-/g, '-')}`; // Convert YYYY-MM-DD to YY-MM-DD
        
        const slotData = doctorSlots.slots.find(slot => slot.date === formattedDate);
        return slotData ? slotData.time_slot : [];
    };

    // Check if a date has available slots
    const hasAvailableSlots = (date) => {
        return getSlotsForDate(date).length > 0;
    };

    // Check if date is within 30 days from today
    const isWithin30Days = (date) => {
        return date >= today && date <= maxDate;
    };

    // Handle slot selection
    const handleSlotSelect = (date, timeSlot) => {
        const slotInfo = {
            doctor_id: doctorId,
            date: date.toISOString().split('T')[0],
            day: date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase(),
            time_slot: timeSlot,
            formatted_date: date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
        };
        
        setSelectedSlot(slotInfo);
        console.log('Selected Slot:', slotInfo);
    };

    // Calendar navigation
    const navigateMonth = (direction) => {
        setCurrentMonth(prev => {
            const newMonth = new Date(prev);
            newMonth.setMonth(newMonth.getMonth() + direction);
            return newMonth;
        });
    };

    // Get days in month
    const getDaysInMonth = (month) => {
        const year = month.getFullYear();
        const monthNumber = month.getMonth();
        const firstDay = new Date(year, monthNumber, 1);
        const lastDay = new Date(year, monthNumber + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDayOfWeek = firstDay.getDay();

        const days = [];
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startDayOfWeek; i++) {
            days.push(null);
        }
        
        // Add all days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, monthNumber, day));
        }
        
        return days;
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8 flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                    <p className="mt-4 text-gray-600">Loading available slots...</p>
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

    const days = getDaysInMonth(currentMonth);
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 bg-gray-50">
            {/* Header */}
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-blue-800 mb-2">Book Your Appointment</h1>
                <p className="text-lg text-gray-600">Select a date and time that works best for you</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                {/* Calendar Header */}
                <div className="flex justify-between items-center mb-6">
                    <button
                        onClick={() => navigateMonth(-1)}
                        className="p-2 hover:bg-gray-100 rounded-full transition"
                        disabled={currentMonth.getMonth() === today.getMonth() && currentMonth.getFullYear() === today.getFullYear()}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    
                    <h2 className="text-xl font-semibold text-gray-800">
                        {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h2>
                    
                    <button
                        onClick={() => navigateMonth(1)}
                        className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>

                {/* Days of Week */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                    {daysOfWeek.map(day => (
                        <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                    {days.map((day, index) => {
                        if (!day) {
                            return <div key={index} className="h-12" />;
                        }

                        const isToday = day.toDateString() === today.toDateString();
                        const isPast = day < today;
                        const isSelectable = isWithin30Days(day) && !isPast;
                        const hasSlots = hasAvailableSlots(day);
                        const isBeyond30Days = day > maxDate;

                        return (
                            <div
                                key={index}
                                className={`h-12 rounded-lg border cursor-default relative ${
                                    isToday ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                                } ${
                                    isPast ? 'bg-gray-100 text-gray-400' : ''
                                } ${
                                    isSelectable && hasSlots ? 'hover:bg-green-50 border-green-200' : ''
                                } ${
                                    isBeyond30Days ? 'bg-gray-100 text-gray-400' : ''
                                }`}
                            >
                                <span className="absolute top-1 left-2 text-sm">
                                    {day.getDate()}
                                </span>
                                
                                {isSelectable && hasSlots && (
                                    <span className="absolute bottom-1 right-1 w-2 h-2 bg-green-500 rounded-full" />
                                )}
                                
                                {isBeyond30Days && (
                                    <span className="absolute bottom-1 right-1 text-xs text-red-400">×</span>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Legend */}
                <div className="mt-6 flex justify-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                        <span>Available Slots</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gray-400 rounded-full" />
                        <span>Past Dates / Beyond 30 days</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 border-2 border-blue-600 rounded-full" />
                        <span>Today</span>
                    </div>
                </div>
            </div>

            {/* Time Slots Section */}
            <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Available Time Slots</h3>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    {days.filter(day => day && isWithin30Days(day) && !day < today && hasAvailableSlots(day)).length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <AlertCircle className="mx-auto mb-2" size={24} />
                            <p>No available slots for the selected period</p>
                            <p className="text-sm mt-1">Please select a different date range</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {days.filter(day => day && isWithin30Days(day) && !day < today && hasAvailableSlots(day)).map(day => (
                                <div key={day.toISOString()} className="border border-gray-200 rounded-lg p-4">
                                    <h4 className="font-medium text-gray-800 mb-3">
                                        {day.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {getSlotsForDate(day).map(slot => (
                                            <button
                                                key={slot}
                                                onClick={() => handleSlotSelect(day, slot)}
                                                className={`p-2 text-sm rounded border transition ${
                                                    selectedSlot?.date === day.toISOString().split('T')[0] && 
                                                    selectedSlot?.time_slot === slot
                                                        ? 'bg-blue-600 text-white border-blue-600'
                                                        : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                                                }`}
                                            >
                                                <Clock className="inline mr-1" size={12} />
                                                {slot}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Selected Slot Display */}
            {selectedSlot && (
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">Selected Appointment</h4>
                    <p className="text-blue-700">
                        {selectedSlot.formatted_date} at {selectedSlot.time_slot}
                    </p>
                </div>
            )}
        </div>
    );
};

export default BookAppointment;