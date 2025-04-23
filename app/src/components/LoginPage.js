import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {User, Lock} from 'lucide-react';
const LoginPage = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [errors, setErrors] = useState({
        username: '',
        password: ''
    });

    const validateForm = () => {
         // Validate form
         const newErrors = {};
         if (!formData.username) {
             newErrors.username = 'Username is required';
         }
         
         if (!formData.password) {
             newErrors.password = 'Password is required';
         } else if (formData.password.length < 8) {
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

        if(errors[name]){
            setErrors({
                ...errors,
                [name]: ''
            })
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault()
        if(!validateForm()){
            return;
        }

        try {
            
            const reqData = new URLSearchParams();

            reqData.append("username", formData.username);
            reqData.append("password", formData.password);
            const response = await fetch("http://localhost:8000/auth/token",{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: reqData,
            });

            if(!response.ok){
                const errorData = await response.json()
                throw new Error(errorData.message || 'Login Failed');
            }else{
                setTimeout(() => {
                        console.log("inside setTimeout");
                        navigate(`/patient-profile`);
                      }, 1500);
            }

            const data = await response.json()
            console.log(data.access_token);

            const token = data.access_token;
            localStorage.setItem("token", token);
            console.log("My token", localStorage.getItem("token"));
            



        }catch(error){
            console.error('Registration error:', error);

        }

        console.log("username:", formData.username);
        console.log("password:", formData.password);

    }

    return (
        <div>
            <div>
                <form onSubmit={handleLogin}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        {/* password */}
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
                            <p className="text-gray-500 text-sm mt-1">{errors.password ?"":"Password must be at least 8 characters long"}</p>
                        </div>

                        <div className="mt-6">
                        <button 
                            type="submit" 
                            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300"
                        >
                            Log In
                        </button>
                    </div>

                    </div>
                    
                </form>
            </div>
        </div>
    );
}

export default LoginPage;