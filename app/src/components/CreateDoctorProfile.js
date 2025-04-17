import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Save, Award, MapPin, Building, User } from 'lucide-react';

const CreateDoctorProfile = () => {
    const navigate = useNavigate();
    const { userId } = useParams(); // Get userId from URL parameter
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Form data state reflecting the DoctorCreate schema structure
    const [formData, setFormData] = useState({
        doctor: {
            speciality: '',
            experience: '',
            consultation_fee: '',
            bio: ''
        },
        qualification: {
            qualification_name: '',
            course_duration: '',
            year_completed: ''
        },
        institute: {
            name: '',
            type: 'university' // Default value
        },
        doctor_clinic_with_address: {
            clinic_info: {
                clinic_name: '',
                clinic_phone: '',
                is_primary_location: true,
                consultation_hours_notes: ''
            },
            clinic_address: {
                street_address: '',
                area_name: '',
                city: '',
                state: '',
                pincode: '',
                country: '',
                address_type: 'other' // Default value
            }
        }
    });

    // Handle input changes for nested objects
    const handleInputChange = (section, field, value) => {
        if (section.includes('.')) {
            const [mainSection, subSection, subField] = section.split('.');
            setFormData({
                ...formData,
                [mainSection]: {
                    ...formData[mainSection],
                    [subSection]: {
                        ...formData[mainSection][subSection],
                        [subField || field]: value
                    }
                }
            });
        } else {
            setFormData({
                ...formData,
                [section]: {
                    ...formData[section],
                    [field]: value
                }
            });
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            // Convert numeric values
            const dataToSubmit = {
                ...formData,
                doctor: {
                    ...formData.doctor,
                    experience: parseInt(formData.doctor.experience, 10),
                    consultation_fee: parseFloat(formData.doctor.consultation_fee)
                },
                qualification: {
                    ...formData.qualification,
                    year_completed: parseInt(formData.qualification.year_completed, 10)
                },
                doctor_clinic_with_address: {
                    ...formData.doctor_clinic_with_address,
                    clinic_address: {
                        ...formData.doctor_clinic_with_address.clinic_address,
                        pincode: parseInt(formData.doctor_clinic_with_address.clinic_address.pincode, 10)
                    }
                }
            };

            const response = await fetch(`http://localhost:8000/doctor/doctor-profile/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSubmit),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to create doctor profile');
            }

            const data = await response.json()

            setSuccess(true);
            // Redirect to doctor profile page after successful submission
            setTimeout(() => {
                navigate(`/doctor-profile/${data.doctor.id}`);
            }, 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Navigation between steps
    const nextStep = () => setCurrentStep(currentStep + 1);
    const prevStep = () => setCurrentStep(currentStep - 1);

    // Validation for current step
    const validateCurrentStep = () => {
        switch (currentStep) {
            case 1: // Doctor information
                return (
                    formData.doctor.speciality &&
                    formData.doctor.experience &&
                    formData.doctor.consultation_fee
                );
            case 2: // Qualification
                return (
                    formData.qualification.qualification_name &&
                    formData.qualification.course_duration &&
                    formData.qualification.year_completed &&
                    formData.institute.name &&
                    formData.institute.type
                );
            case 3: // Clinic information
                return (
                    formData.doctor_clinic_with_address.clinic_info.clinic_name &&
                    formData.doctor_clinic_with_address.clinic_info.clinic_phone
                );
            case 4: // Clinic address
                return (
                    formData.doctor_clinic_with_address.clinic_address.street_address &&
                    formData.doctor_clinic_with_address.clinic_address.city &&
                    formData.doctor_clinic_with_address.clinic_address.state &&
                    formData.doctor_clinic_with_address.clinic_address.pincode &&
                    formData.doctor_clinic_with_address.clinic_address.country
                );
            default:
                return true;
        }
    };

    // Render step indicators
    const renderStepIndicators = () => {
        const steps = [
            { num: 1, title: 'Personal', icon: <User className="w-5 h-5" /> },
            { num: 2, title: 'Qualifications', icon: <Award className="w-5 h-5" /> },
            { num: 3, title: 'Clinic Details', icon: <Building className="w-5 h-5" /> },
            { num: 4, title: 'Clinic Address', icon: <MapPin className="w-5 h-5" /> },
            { num: 5, title: 'Review', icon: <Save className="w-5 h-5" /> }
        ];

        return (
            <div className="flex justify-between mb-8">
                {steps.map((step) => (
                    <div
                        key={step.num}
                        className={`flex flex-col items-center ${currentStep >= step.num ? 'text-blue-600' : 'text-gray-400'
                            }`}
                    >
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full mb-2 ${currentStep >= step.num ? 'bg-blue-100' : 'bg-gray-100'
                            }`}>
                            {step.icon}
                        </div>
                        <span className="text-sm font-medium">{step.title}</span>
                    </div>
                ))}
            </div>
        );
    };

    // Render form step content
    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800">Doctor Information</h2>
                        <p className="text-gray-600 mb-6">Please provide your professional details.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Speciality *
                                </label>
                                <input
                                    type="text"
                                    value={formData.doctor.speciality}
                                    onChange={(e) => handleInputChange('doctor', 'speciality', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="e.g., Cardiology, Dermatology"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Years of Experience *
                                </label>
                                <input
                                    type="number"
                                    value={formData.doctor.experience}
                                    onChange={(e) => handleInputChange('doctor', 'experience', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="e.g., 5"
                                    min="0"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Consultation Fee (in USD) *
                            </label>
                            <input
                                type="number"
                                value={formData.doctor.consultation_fee}
                                onChange={(e) => handleInputChange('doctor', 'consultation_fee', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., 100.00"
                                step="0.01"
                                min="0"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Professional Bio
                            </label>
                            <textarea
                                value={formData.doctor.bio}
                                onChange={(e) => handleInputChange('doctor', 'bio', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Tell patients about your professional journey and approach to care..."
                                rows="4"
                            />
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800">Qualifications</h2>
                        <p className="text-gray-600 mb-6">Tell us about your educational background.</p>

                        <div className="bg-gray-50 p-4 rounded-md mb-6">
                            <h3 className="text-lg font-semibold mb-3">Educational Qualification</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Qualification Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.qualification.qualification_name}
                                        onChange={(e) => handleInputChange('qualification', 'qualification_name', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="e.g., MD, MBBS"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Course Duration *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.qualification.course_duration}
                                        onChange={(e) => handleInputChange('qualification', 'course_duration', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="e.g., 4 years"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Year Completed *
                                </label>
                                <input
                                    type="number"
                                    value={formData.qualification.year_completed}
                                    onChange={(e) => handleInputChange('qualification', 'year_completed', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="e.g., 2015"
                                    min="1950"
                                    max={new Date().getFullYear()}
                                    required
                                />
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-md">
                            <h3 className="text-lg font-semibold mb-3">Institute Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Institute Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.institute.name}
                                        onChange={(e) => handleInputChange('institute', 'name', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="e.g., Harvard Medical School"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Institute Type *
                                    </label>
                                    <select
                                        value={formData.institute.type}
                                        onChange={(e) => handleInputChange('institute', 'type', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        <option value="university">University</option>
                                        <option value="college">College</option>
                                        <option value="training_center">Training Center</option>
                                        <option value="research_institute">Research Institute</option>
                                        <option value="hospital">Hospital</option>
                                        <option value="medical_university">Medical University</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800">Clinic Information</h2>
                        <p className="text-gray-600 mb-6">Tell us about your clinic or practice location.</p>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Clinic Name *
                            </label>
                            <input
                                type="text"
                                value={formData.doctor_clinic_with_address.clinic_info.clinic_name}
                                onChange={(e) => handleInputChange('doctor_clinic_with_address.clinic_info', 'clinic_name', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., City Heart Center"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Clinic Phone Number *
                            </label>
                            <input
                                type="tel"
                                value={formData.doctor_clinic_with_address.clinic_info.clinic_phone}
                                onChange={(e) => handleInputChange('doctor_clinic_with_address.clinic_info', 'clinic_phone', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., +1 555-123-4567"
                                required
                            />
                        </div>

                        <div className="flex items-center mt-2">
                            <input
                                type="checkbox"
                                id="isPrimaryLocation"
                                checked={formData.doctor_clinic_with_address.clinic_info.is_primary_location}
                                onChange={(e) => handleInputChange('doctor_clinic_with_address.clinic_info', 'is_primary_location', e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="isPrimaryLocation" className="ml-2 block text-sm text-gray-700">
                                This is my primary practice location
                            </label>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Consultation Hours Notes
                            </label>
                            <textarea
                                value={formData.doctor_clinic_with_address.clinic_info.consultation_hours_notes}
                                onChange={(e) => handleInputChange('doctor_clinic_with_address.clinic_info', 'consultation_hours_notes', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., Monday-Friday: 9 AM - 5 PM, Saturday: 9 AM - 1 PM"
                                rows="3"
                            />
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800">Clinic Address</h2>
                        <p className="text-gray-600 mb-6">Provide the location details of your clinic.</p>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Street Address *
                            </label>
                            <input
                                type="text"
                                value={formData.doctor_clinic_with_address.clinic_address.street_address}
                                onChange={(e) => handleInputChange('doctor_clinic_with_address.clinic_address', 'street_address', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., 123 Medical Plaza, Suite 101"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Area Name
                            </label>
                            <input
                                type="text"
                                value={formData.doctor_clinic_with_address.clinic_address.area_name}
                                onChange={(e) => handleInputChange('doctor_clinic_with_address.clinic_address', 'area_name', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., Downtown"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    City *
                                </label>
                                <input
                                    type="text"
                                    value={formData.doctor_clinic_with_address.clinic_address.city}
                                    onChange={(e) => handleInputChange('doctor_clinic_with_address.clinic_address', 'city', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="e.g., New York"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    State *
                                </label>
                                <input
                                    type="text"
                                    value={formData.doctor_clinic_with_address.clinic_address.state}
                                    onChange={(e) => handleInputChange('doctor_clinic_with_address.clinic_address', 'state', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="e.g., NY"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Postal/Zip Code *
                                </label>
                                <input
                                    type="number"
                                    value={formData.doctor_clinic_with_address.clinic_address.pincode}
                                    onChange={(e) => handleInputChange('doctor_clinic_with_address.clinic_address', 'pincode', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="e.g., 10001"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Country *
                                </label>
                                <input
                                    type="text"
                                    value={formData.doctor_clinic_with_address.clinic_address.country}
                                    onChange={(e) => handleInputChange('doctor_clinic_with_address.clinic_address', 'country', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="e.g., USA"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Address Type
                            </label>
                            <select
                                value={formData.doctor_clinic_with_address.clinic_address.address_type}
                                onChange={(e) => handleInputChange('doctor_clinic_with_address.clinic_address', 'address_type', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="home">Home</option>
                                <option value="work">Work</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800">Review Your Information</h2>
                        <p className="text-gray-600 mb-6">Please review all information before submitting.</p>

                        <div className="bg-gray-50 p-4 rounded-md">
                            <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Speciality</p>
                                    <p className="font-medium">{formData.doctor.speciality}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Experience</p>
                                    <p className="font-medium">{formData.doctor.experience} years</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Consultation Fee</p>
                                    <p className="font-medium">${formData.doctor.consultation_fee}</p>
                                </div>
                            </div>
                            {formData.doctor.bio && (
                                <div className="mt-3">
                                    <p className="text-sm text-gray-500">Bio</p>
                                    <p className="text-sm mt-1">{formData.doctor.bio}</p>
                                </div>
                            )}
                        </div>

                        <div className="bg-gray-50 p-4 rounded-md">
                            <h3 className="text-lg font-semibold mb-3">Qualifications</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Qualification</p>
                                    <p className="font-medium">{formData.qualification.qualification_name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Course Duration</p>
                                    <p className="font-medium">{formData.qualification.course_duration}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Year Completed</p>
                                    <p className="font-medium">{formData.qualification.year_completed}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Institute</p>
                                    <p className="font-medium">{formData.institute.name}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-md">
                            <h3 className="text-lg font-semibold mb-3">Clinic Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Clinic Name</p>
                                    <p className="font-medium">{formData.doctor_clinic_with_address.clinic_info.clinic_name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Phone</p>
                                    <p className="font-medium">{formData.doctor_clinic_with_address.clinic_info.clinic_phone}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Primary Location</p>
                                    <p className="font-medium">{formData.doctor_clinic_with_address.clinic_info.is_primary_location ? 'Yes' : 'No'}</p>
                                </div>
                            </div>
                            {formData.doctor_clinic_with_address.clinic_info.consultation_hours_notes && (
                                <div className="mt-3">
                                    <p className="text-sm text-gray-500">Hours</p>
                                    <p className="text-sm mt-1">{formData.doctor_clinic_with_address.clinic_info.consultation_hours_notes}</p>
                                </div>
                            )}
                        </div>

                        <div className="bg-gray-50 p-4 rounded-md">
                            <h3 className="text-lg font-semibold mb-3">Clinic Address</h3>
                            <p className="font-medium">
                                {formData.doctor_clinic_with_address.clinic_address.street_address}<br />
                                {formData.doctor_clinic_with_address.clinic_address.area_name &&
                                    <>
                                        {formData.doctor_clinic_with_address.clinic_address.area_name}<br />
                                    </>
                                }
                                {formData.doctor_clinic_with_address.clinic_address.city}, {formData.doctor_clinic_with_address.clinic_address.state} {formData.doctor_clinic_with_address.clinic_address.pincode}<br />
                                {formData.doctor_clinic_with_address.clinic_address.country}
                            </p>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    // Show response messages
    const renderMessages = () => {
        if (error) {
            return (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
                    <div className="flex">
                        <div className="ml-3">
                            <p className="text-sm text-red-700">
                                Error: {error}
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        if (success) {
            return (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 my-4">
                    <div className="flex">
                        <div className="ml-3">
                            <p className="text-sm text-green-700">
                                Doctor profile created successfully! Redirecting to profile page...
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        return null;
    };

    // Navigation buttons
    const renderNavButtons = () => {
        const isLastStep = currentStep === 5;
        const isFirstStep = currentStep === 1;
        const isNextDisabled = !validateCurrentStep();

        return (
            <div className="flex justify-between mt-8">
                {!isFirstStep && (
                    <button
                        type="button"
                        onClick={prevStep}
                        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Previous
                    </button>
                )}
                {isFirstStep && <div></div>}

                {!isLastStep ? (
                    <button
                        type="button"
                        onClick={nextStep}
                        disabled={isNextDisabled}
                        className={`flex items-center px-4 py-2 text-sm font-medium text-white rounded-md ${isNextDisabled
                            ? 'bg-blue-300 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        Next
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                ) : (
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
                            }`}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Profile'}
                        <Save className="w-4 h-4 ml-2" />
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Create Doctor Profile</h1>

            {renderStepIndicators()}
            {renderMessages()}

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
                {renderStepContent()}
                {renderNavButtons()}
            </form>
        </div>
    );
};

export default CreateDoctorProfile;