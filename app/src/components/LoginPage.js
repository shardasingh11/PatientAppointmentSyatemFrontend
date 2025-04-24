import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock } from 'lucide-react';
import { useAuth } from "../context/AuthContext.js";

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [errors, setErrors] = useState({
        username: '',
        password: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [loginSuccess, setLoginSuccess] = useState(false);

    const validateForm = () => {
        // Validate form
        const newErrors = {};
        if (!formData.username) {
            newErrors.username = 'Username is required';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 4) {
            newErrors.password = 'Password must be at least 8 characters long';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return false;
        }

        return true;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            })
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault()
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setLoginError('');

        try {
            const reqData = new URLSearchParams();

            reqData.append("username", formData.username);
            reqData.append("password", formData.password);
            const response = await fetch("http://localhost:8000/auth/token", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: reqData,
            });

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Login Failed');
            } else {
                const data = await response.json()
                console.log(data.access_token);

                const token = data.access_token;
                const expiryTime = new Date(data.expiry_time);

                
                login(token,expiryTime);
                setLoginSuccess(true);

                setTimeout(() => {
                    navigate(`/`);
                }, 1500);
            }
        } catch (error) {
            console.error('Login error:', error);
            setLoginError(error.message || 'Login failed. Please try again.');
        }

        setIsSubmitting(false);
        console.log("username:", formData.username);
        console.log("password:", formData.password);
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome Back</h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Log in to access your account and manage your healthcare appointments
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Left side - Benefits */}
                <div className="w-full md:w-1/3 bg-blue-50 rounded-xl p-6 shadow-md">
                    <h3 className="text-2xl font-semibold mb-6 text-blue-800">Why Choose Us?</h3>

                    <div className="space-y-6">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800">Instant Access</h4>
                                <p className="text-gray-600">Access your appointments and medical information in one place</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800">Secure Login</h4>
                                <p className="text-gray-600">Your personal health data is protected and encrypted</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800">24/7 Availability</h4>
                                <p className="text-gray-600">Book appointments any time, day or night</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 p-4 bg-blue-100 rounded-lg">
                        <p className="text-blue-800 font-medium">
                            "The patient portal has revolutionized how I manage my health appointments!"
                        </p>
                        <p className="text-sm text-blue-700 mt-2">— Michael Davis, Patient</p>
                    </div>
                </div>

                {/* Right side - Login Form */}
                <div className="w-full md:w-2/3">
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        {loginSuccess && (
                            <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg flex items-center">
                                <div className="flex-shrink-0 w-8 h-8 bg-green-200 rounded-full flex items-center justify-center mr-3">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </div>
                                <span>Login successful! Redirecting you to your dashboard...</span>
                            </div>
                        )}

                        {loginError && (
                            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
                                <div className="flex-shrink-0 w-8 h-8 bg-red-200 rounded-full flex items-center justify-center mr-3">
                                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </div>
                                <span>{loginError}</span>
                            </div>
                        )}

                        <form onSubmit={handleLogin}>
                            <div className="space-y-6">
                                {/* Username */}
                                <div>
                                    <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
                                        Username*
                                    </label>
                                    <div className={`relative ${errors.username ? 'text-red-500' : 'text-gray-500'}`}>
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                            <User size={18} />
                                        </span>
                                        <input
                                            type="text"
                                            id="username"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            className={`w-full pl-10 py-3 border rounded-lg focus:outline-none focus:ring-2 
                                                ${errors.username
                                                    ? 'border-red-300 focus:border-red-300 focus:ring-red-200'
                                                    : 'border-gray-300 focus:border-blue-300 focus:ring-blue-200'}`}
                                        />
                                    </div>
                                    {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                                </div>

                                {/* Password */}
                                <div>
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
                                    <p className="text-gray-500 text-sm mt-1">{errors.password ? "" : "Password must be at least 8 characters long"}</p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <a href="#" className="text-sm text-blue-600 hover:underline">
                                            Forgot your password?
                                        </a>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 shadow-lg"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Logging in...' : 'Log In'}
                                </button>
                            </div>
                        </form>

                        <div className="mt-6 text-center text-gray-600">
                            Don't have an account? <a href="/register" className="text-blue-600 font-medium hover:underline">Sign up</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;