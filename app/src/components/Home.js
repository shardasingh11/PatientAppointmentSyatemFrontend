import { Calendar, Clock, User, Check, Award, Shield } from 'lucide-react';

const Home = () => {
    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Hero Section */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Patient Appointment System</h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Streamlining healthcare scheduling for better patient experience and clinic efficiency
                </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                {/* Card 1 */}
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition duration-300">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                        <Calendar className="text-blue-600" size={24} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Easy Scheduling</h3>
                    <p className="text-gray-600">
                        Book appointments 24/7 from anywhere. Choose your preferred doctor, date, and time slot with our intuitive interface.
                    </p>
                </div>

                {/* Card 2 */}
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition duration-300">
                    <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                        <Clock className="text-green-600" size={24} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Automated Reminders</h3>
                    <p className="text-gray-600">
                        Never miss an appointment with automated SMS and email reminders sent before your scheduled visits.
                    </p>
                </div>

                {/* Card 3 */}
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition duration-300">
                    <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
                        <User className="text-purple-600" size={24} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Patient Portal</h3>
                    <p className="text-gray-600">
                        Access your medical history, upcoming appointments, and test results through a secure patient portal.
                    </p>
                </div>

                {/* Card 4 */}
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition duration-300">
                    <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mb-4">
                        <Check className="text-yellow-600" size={24} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Quick Check-in</h3>
                    <p className="text-gray-600">
                        Save time with our digital check-in process. Complete forms online before your visit to reduce waiting time.
                    </p>
                </div>

                {/* Card 5 */}
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition duration-300">
                    <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4">
                        <Award className="text-red-600" size={24} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Expert Care</h3>
                    <p className="text-gray-600">
                        Connect with qualified healthcare professionals specializing in various medical fields for comprehensive care.
                    </p>
                </div>

                {/* Card 6 */}
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition duration-300">
                    <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full mb-4">
                        <Shield className="text-indigo-600" size={24} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
                    <p className="text-gray-600">
                        Your health information is protected with industry-standard encryption and strict privacy protocols.
                    </p>
                </div>
            </div>

            {/* Call to Action */}
            <div className="mt-16 text-center">

                <a href='/register'>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow transition duration-300">
                        Register Now
                    </button>
                </a>
                <p className="mt-4 text-gray-600">
                    Join thousands of patients who have simplified their healthcare experience
                </p>
            </div>
        </div>
    );
};

export default Home;