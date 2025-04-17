import { useState } from 'react';
import { User, Mail, Phone, Lock, Calendar, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const UserRegistration = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    age: '',
    gender: '',
    mobile_no: '',
    gmail: '',
    password: '',
    user_role: 'patient' // Default role
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [userWithPatient, setUserWithPatient] = useState(null);
  const [userId, setUserId] = useState(null)

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (isNaN(formData.age) || parseInt(formData.age) <= 0) {
      newErrors.age = 'Age must be a positive number';
    }
    
    if (!formData.gender) newErrors.gender = 'Gender is required';
    
    const mobileRegex = /^\+?1?\d{9,15}$/;
    if (!formData.mobile_no) {
      newErrors.mobile_no = 'Mobile number is required';
    } else if (!mobileRegex.test(formData.mobile_no)) {
      newErrors.mobile_no = 'Mobile number format is invalid';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.gmail) {
      newErrors.gmail = 'Email is required';
    } else if (!emailRegex.test(formData.gmail)) {
      newErrors.gmail = 'Email format is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formErrors = validateForm();
    setErrors(formErrors);
    
    if (Object.keys(formErrors).length === 0) {
      try {
        // Send data to your API endpoint
        const response = await fetch('http://localhost:8000/users/user-register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        if (!response.ok) {
          // If the server responds with an error
          const errorData = await response.json();
          throw new Error(errorData.message || 'Registration failed');
        }
        
        const data = await response.json();
        setUserWithPatient(data);
        setUserId(data.user.id);
        console.log(`setted user id ${data.user.id}`);
        console.log('Registration successful:', data);
        setRegistrationSuccess(true);


       if(data.user.user_role.toLowerCase() === "patient"){
          setTimeout(() => {
            console.log("inside setTimeout");
            navigate(`/patient-profile/${data.user.id}`, { 
              state: { profileData: data } 
            });
          }, 1500);
       }else if(data.user.user_role.toLowerCase() === "doctor"){
            setTimeout(()=> {
              navigate(`/create-doctor-profile/${data.user.id}`)
            }, 1500);
       }
        
        // Reset form after successful submission
        setFormData({
          first_name: '',
          last_name: '',
          age: '',
          gender: '',
          mobile_no: '',
          gmail: '',
          password: '',
          user_role: 'patient'
        });
        
      } catch (error) {
        console.error('Registration error:', error);
        setErrors({ submit: error.message || 'Registration failed. Please try again.' });
      }
    }
    
    setIsSubmitting(false);
    console.log("end of the userRegistration");
    
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Create Your Account</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Join our patient appointment system to easily book and manage your healthcare visits
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left side - Benefits */}
        <div className="w-full md:w-1/3 bg-blue-50 rounded-xl p-6 shadow-md">
          <h3 className="text-2xl font-semibold mb-6 text-blue-800">Why Register With Us?</h3>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <Calendar className="text-blue-600" size={20} />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800">Easy Appointments</h4>
                <p className="text-gray-600">Book and manage your appointments anytime, anywhere</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <Users className="text-green-600" size={20} />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800">Access to Specialists</h4>
                <p className="text-gray-600">Connect with qualified healthcare professionals</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                <Lock className="text-purple-600" size={20} />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800">Secure & Private</h4>
                <p className="text-gray-600">Your health information is protected with encryption</p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-100 rounded-lg">
            <p className="text-blue-800 font-medium">
              "The appointment system has made scheduling my doctor visits so much easier. Highly recommended!"
            </p>
            <p className="text-sm text-blue-700 mt-2">— Sarah Johnson, Patient</p>
          </div>
        </div>
        
        {/* Right side - Registration Form */}
        <div className="w-full md:w-2/3">
          <div className="bg-white rounded-xl shadow-lg p-8">
            {registrationSuccess && (
              <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg flex items-center">
                <div className="flex-shrink-0 w-8 h-8 bg-green-200 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span>Registration successful! You can now log in to your account.</span>
              </div>
            )}
            
            {errors.submit && (
              <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
                {errors.submit}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label htmlFor="first_name" className="block text-gray-700 font-medium mb-2">
                    First Name*
                  </label>
                  <div className={`relative ${errors.first_name ? 'text-red-500' : 'text-gray-500'}`}>
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <User size={18} />
                    </span>
                    <input
                      type="text"
                      id="first_name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      className={`w-full pl-10 py-3 border rounded-lg focus:outline-none focus:ring-2 
                        ${errors.first_name 
                          ? 'border-red-300 focus:border-red-300 focus:ring-red-200' 
                          : 'border-gray-300 focus:border-blue-300 focus:ring-blue-200'}`}
                    />
                  </div>
                  {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>}
                </div>

                {/* Last Name */}
                <div>
                  <label htmlFor="last_name" className="block text-gray-700 font-medium mb-2">
                    Last Name*
                  </label>
                  <div className={`relative ${errors.last_name ? 'text-red-500' : 'text-gray-500'}`}>
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <User size={18} />
                    </span>
                    <input
                      type="text"
                      id="last_name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      className={`w-full pl-10 py-3 border rounded-lg focus:outline-none focus:ring-2 
                        ${errors.last_name 
                          ? 'border-red-300 focus:border-red-300 focus:ring-red-200' 
                          : 'border-gray-300 focus:border-blue-300 focus:ring-blue-200'}`}
                    />
                  </div>
                  {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Age */}
                <div>
                  <label htmlFor="age" className="block text-gray-700 font-medium mb-2">
                    Age*
                  </label>
                  <div className={`relative ${errors.age ? 'text-red-500' : 'text-gray-500'}`}>
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <Calendar size={18} />
                    </span>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className={`w-full pl-10 py-3 border rounded-lg focus:outline-none focus:ring-2 
                        ${errors.age 
                          ? 'border-red-300 focus:border-red-300 focus:ring-red-200' 
                          : 'border-gray-300 focus:border-blue-300 focus:ring-blue-200'}`}
                    />
                  </div>
                  {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
                </div>

                {/* Gender */}
                <div>
                  <label htmlFor="gender" className="block text-gray-700 font-medium mb-2">
                    Gender*
                  </label>
                  <div className={`relative ${errors.gender ? 'text-red-500' : 'text-gray-500'}`}>
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <Users size={18} />
                    </span>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className={`w-full pl-10 py-3 border rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 
                        ${errors.gender 
                          ? 'border-red-300 focus:border-red-300 focus:ring-red-200' 
                          : 'border-gray-300 focus:border-blue-300 focus:ring-blue-200'}`}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="others">Other</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                      </svg>
                    </div>
                  </div>
                  {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                </div>
              </div>

              {/* Mobile Number */}
              <div className="mt-6">
                <label htmlFor="mobile_no" className="block text-gray-700 font-medium mb-2">
                  Mobile Number*
                </label>
                <div className={`relative ${errors.mobile_no ? 'text-red-500' : 'text-gray-500'}`}>
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <Phone size={18} />
                  </span>
                  <input
                    type="tel"
                    id="mobile_no"
                    name="mobile_no"
                    value={formData.mobile_no}
                    onChange={handleChange}
                    placeholder="e.g. +1234567890"
                    className={`w-full pl-10 py-3 border rounded-lg focus:outline-none focus:ring-2 
                      ${errors.mobile_no 
                        ? 'border-red-300 focus:border-red-300 focus:ring-red-200' 
                        : 'border-gray-300 focus:border-blue-300 focus:ring-blue-200'}`}
                  />
                </div>
                {errors.mobile_no && <p className="text-red-500 text-sm mt-1">{errors.mobile_no}</p>}
              </div>

              {/* Email */}
              <div className="mt-6">
                <label htmlFor="gmail" className="block text-gray-700 font-medium mb-2">
                  Email*
                </label>
                <div className={`relative ${errors.gmail ? 'text-red-500' : 'text-gray-500'}`}>
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail size={18} />
                  </span>
                  <input
                    type="email"
                    id="gmail"
                    name="gmail"
                    value={formData.gmail}
                    onChange={handleChange}
                    className={`w-full pl-10 py-3 border rounded-lg focus:outline-none focus:ring-2 
                      ${errors.gmail 
                        ? 'border-red-300 focus:border-red-300 focus:ring-red-200' 
                        : 'border-gray-300 focus:border-blue-300 focus:ring-blue-200'}`}
                  />
                </div>
                {errors.gmail && <p className="text-red-500 text-sm mt-1">{errors.gmail}</p>}
              </div>

              {/* Password */}
              <div className="mt-6">
                <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                  Password*
                </label>
                <div className={`relative ${errors.password ? 'text-red-500' : 'text-gray-500'}`}>
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock size={18} />
                  </span>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 py-3 border rounded-lg focus:outline-none focus:ring-2 
                      ${errors.password 
                        ? 'border-red-300 focus:border-red-300 focus:ring-red-200' 
                        : 'border-gray-300 focus:border-blue-300 focus:ring-blue-200'}`}
                  />
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                <p className="text-gray-500 text-sm mt-1">Password must be at least 8 characters long</p>
              </div>

              {/* User Role */}
              <div className="mt-6">
                <label className="block text-gray-700 font-medium mb-4">
                  I am registering as:
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div 
                    className={`p-4 border rounded-lg cursor-pointer transition-all 
                      ${formData.user_role === 'patient' 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-300 hover:border-gray-400'}`}
                    onClick={() => setFormData({...formData, user_role: 'patient'})}
                  >
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        id="role_patient" 
                        name="user_role" 
                        value="patient"
                        checked={formData.user_role === 'patient'}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <label htmlFor="role_patient" className="font-medium">Patient</label>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Looking for healthcare services</p>
                  </div>
                  
                  <div 
                    className={`p-4 border rounded-lg cursor-pointer transition-all 
                      ${formData.user_role === 'doctor' 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-300 hover:border-gray-400'}`}
                    onClick={() => setFormData({...formData, user_role: 'doctor'})}
                  >
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        id="role_doctor" 
                        name="user_role" 
                        value="doctor"
                        checked={formData.user_role === 'doctor'}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <label htmlFor="role_doctor" className="font-medium">Doctor</label>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Providing healthcare services</p>
                  </div>
                  
                  
                </div>
              </div>

              {/* Terms and conditions */}
              <div className="mt-8">
                <div className="flex items-start">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 mt-1"
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
                    I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="" className="text-blue-600 hover:underline">Privacy Policy</a>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="mt-8 w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 shadow-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 text-center text-gray-600">
              Already have an account? <a href="/login" className="text-blue-600 font-medium hover:underline">Sign in</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRegistration;