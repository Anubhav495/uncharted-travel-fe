import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Upload, CheckCircle } from 'lucide-react';
import TrekSelect from './TrekSelect';
import PasswordModal from '../../modals/registration/PasswordModal';
import { supabase } from '../../../lib/supabaseClient';

const GuideRegistrationWizard: React.FC = () => {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isChecking, setIsChecking] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        countryCode: '+91',
        phone: '',
        password: '',
        city: '',
        state: '',
        yearsExperience: '',
        languages: '',
        treks: [] as string[]
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Restore saved progress from localStorage on mount
    useEffect(() => {
        const savedData = localStorage.getItem('guideRegistrationDraft');
        const savedStep = localStorage.getItem('guideRegistrationStep');

        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                setFormData(parsed);
                console.log('Restored registration progress from localStorage');
            } catch (error) {
                console.error('Failed to restore registration data:', error);
            }
        }

        if (savedStep) {
            setStep(parseInt(savedStep, 10));
        }
    }, []);

    // Auto-save to localStorage whenever formData changes
    useEffect(() => {
        localStorage.setItem('guideRegistrationDraft', JSON.stringify(formData));
    }, [formData]);

    // Save current step to localStorage
    useEffect(() => {
        localStorage.setItem('guideRegistrationStep', step.toString());
    }, [step]);

    const updateField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateStep = (currentStep: number): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (currentStep === 1) {
            // Full Name validation
            if (!formData.fullName.trim()) {
                newErrors.fullName = 'Full name is required';
            }

            // Phone validation
            if (!formData.phone.trim()) {
                newErrors.phone = 'Phone number is required';
            } else if (!/^\d{10}$/.test(formData.phone.trim())) {
                newErrors.phone = 'Invalid phone number';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = async () => {
        if (validateStep(step)) {
            if (step === 1) {
                setIsChecking(true);
                try {
                    // Check for duplicate email or phone
                    const { data, error } = await supabase
                        .from('guides')
                        .select('email, phone')
                        .or(`email.eq.${formData.email},phone.eq.${formData.phone}`);

                    if (error) {
                        console.error("Error checking duplicates:", error);
                        // Proceed with caution or show generic error? 
                        // For now, we'll log it and let them proceed to avoid blocking on network errors
                    }

                    if (data && data.length > 0) {
                        const newErrors: { [key: string]: string } = {};
                        let hasError = false;

                        // Check which one matched
                        // Note: Supabase 'or' query returns rows that match either condition
                        // We need to check the returned rows to see what matched
                        data.forEach(record => {
                            if (record.email === formData.email) {
                                newErrors.email = 'Email is already registered';
                                hasError = true;
                            }
                            if (record.phone === formData.phone) {
                                newErrors.phone = 'Phone number is already registered';
                                hasError = true;
                            }
                        });

                        if (hasError) {
                            setErrors(prev => ({ ...prev, ...newErrors }));
                            setIsChecking(false);
                            return; // Stop navigation
                        }
                    }
                } catch (err) {
                    console.error("Unexpected error checking duplicates:", err);
                } finally {
                    setIsChecking(false);
                }
            }
            setStep(prev => Math.min(prev + 1, 3));
        }
    };
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Only show password modal on final step
        if (step === 3) {
            setIsPasswordModalOpen(true);
        }
    };

    const handleFinalSubmit = async (password: string) => {
        try {
            const finalData = { ...formData, password };
            console.log("Submitting Registration to Supabase:", finalData);

            // 1. Insert into guides table
            const { data: guideData, error: guideError } = await supabase
                .from('guides')
                .insert([
                    {
                        full_name: formData.fullName,
                        email: formData.email,
                        phone: formData.phone,
                        country_code: formData.countryCode,
                        city: formData.city,
                        state: formData.state,
                        years_experience: formData.yearsExperience,
                        languages: formData.languages,
                        // In a real app, hash this password before sending or use Supabase Auth signUp
                        password_hash: password
                    }
                ])
                .select()
                .single();

            if (guideError) throw guideError;

            if (guideData && formData.treks.length > 0) {
                // 2. Insert treks into guide_treks table
                const trekInserts = formData.treks.map(trek => ({
                    guide_id: guideData.id,
                    trek_name: trek
                }));

                const { error: trekError } = await supabase
                    .from('guide_treks')
                    .insert(trekInserts);

                if (trekError) throw trekError;
            }

            // Success
            setIsPasswordModalOpen(false);
            setIsSuccess(true);

            // Clear saved draft after successful submission
            localStorage.removeItem('guideRegistrationDraft');
            localStorage.removeItem('guideRegistrationStep');

            // Redirect after 3 seconds
            setTimeout(() => {
                router.push('/');
            }, 3000);

        } catch (error: any) {
            console.error('Registration Error:', error);
            alert(`Registration failed: ${error.message || 'Unknown error'}`);
        }
    };

    if (isSuccess) {
        return (
            <div className="max-w-2xl mx-auto text-center py-12">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-12 shadow-2xl flex flex-col items-center"
                >
                    <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle className="w-12 h-12 text-green-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">Application Submitted!</h2>
                    <p className="text-gray-300 text-lg mb-2">
                        Your application is currently under review.
                    </p>
                    <p className="text-gray-400 text-base mb-8">
                        We will send you an email once your profile has been approved. Redirecting you to the home page...
                    </p>
                    <div className="w-full bg-gray-700 rounded-full h-2 max-w-xs overflow-hidden">
                        <motion.div
                            className="h-full bg-green-500"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 3, ease: "linear" }}
                        />
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between text-sm font-medium text-gray-400 mb-2">
                    <span className={step >= 1 ? "text-yellow-400" : ""}>Account</span>
                    <span className={step >= 2 ? "text-yellow-400" : ""}>Profile</span>
                    <span className={step >= 3 ? "text-yellow-400" : ""}>Experience</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-yellow-400"
                        initial={{ width: "33%" }}
                        animate={{ width: `${(step / 3) * 100}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                onKeyDown={(e) => {
                    // Prevent form submission via Enter key unless on final step
                    if (e.key === 'Enter' && step !== 3) {
                        e.preventDefault();
                    }
                }}
                className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 sm:p-8 shadow-2xl"
            >
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h2 className="text-2xl font-bold text-white mb-6">Let's get you started</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        className={`w-full bg-gray-800 border ${errors.fullName ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-yellow-400/50 focus:border-transparent outline-none transition-all`}
                                        placeholder="e.g. Rahul Sharma"
                                        value={formData.fullName}
                                        onChange={e => updateField('fullName', e.target.value)}
                                    />
                                    {errors.fullName && (
                                        <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-yellow-400/50 focus:border-transparent outline-none transition-all"
                                        placeholder="rahul@example.com"
                                        value={formData.email}
                                        onChange={e => updateField('email', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                                    <div className="flex gap-2">
                                        <select
                                            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-white focus:ring-2 focus:ring-yellow-400/50 focus:border-transparent outline-none transition-all"
                                            value={formData.countryCode}
                                            onChange={e => updateField('countryCode', e.target.value)}
                                        >
                                            <option value="+91">🇮🇳 +91</option>
                                            <option value="+1">🇺🇸 +1</option>
                                            <option value="+44">🇬🇧 +44</option>
                                            <option value="+61">🇦🇺 +61</option>
                                            <option value="+81">🇯🇵 +81</option>
                                            <option value="+86">🇨🇳 +86</option>
                                            <option value="+33">🇫🇷 +33</option>
                                            <option value="+49">🇩🇪 +49</option>
                                            <option value="+39">🇮🇹 +39</option>
                                            <option value="+34">🇪🇸 +34</option>
                                        </select>
                                        <input
                                            type="tel"
                                            className={`flex-1 bg-gray-800 border ${errors.phone ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-yellow-400/50 focus:border-transparent outline-none transition-all`}
                                            placeholder="XXXXX XXXXX"
                                            value={formData.phone}
                                            onChange={e => updateField('phone', e.target.value)}
                                        />
                                    </div>
                                    {errors.phone && (
                                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                                    )}
                                </div>

                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h2 className="text-2xl font-bold text-white mb-6">Where are you based?</h2>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">City</label>
                                        <input
                                            type="text"
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-yellow-400/50 focus:border-transparent outline-none transition-all"
                                            placeholder="e.g. Manali"
                                            value={formData.city}
                                            onChange={e => updateField('city', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">State</label>
                                        <input
                                            type="text"
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-yellow-400/50 focus:border-transparent outline-none transition-all"
                                            placeholder="e.g. Himachal Pradesh"
                                            value={formData.state}
                                            onChange={e => updateField('state', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Profile Photo</label>
                                    <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-yellow-400/50 transition-colors cursor-pointer bg-gray-800/50">
                                        <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                            <Upload className="w-8 h-8" />
                                        </div>
                                        <p className="text-sm text-gray-300 font-medium">Click to upload or drag and drop</p>
                                        <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h2 className="text-2xl font-bold text-white mb-6">Your Expertise</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Years of Experience</label>
                                    <select
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-yellow-400/50 focus:border-transparent outline-none transition-all appearance-none"
                                        value={formData.yearsExperience}
                                        onChange={e => updateField('yearsExperience', e.target.value)}
                                    >
                                        <option value="">Select experience...</option>
                                        <option value="0-2">0-2 years</option>
                                        <option value="3-5">3-5 years</option>
                                        <option value="5-10">5-10 years</option>
                                        <option value="10+">10+ years</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Languages Spoken</label>
                                    <input
                                        type="text"
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-yellow-400/50 focus:border-transparent outline-none transition-all"
                                        placeholder="e.g. English, Hindi, Pahari"
                                        value={formData.languages}
                                        onChange={e => updateField('languages', e.target.value)}
                                    />
                                </div>

                                <TrekSelect
                                    selectedTreks={formData.treks}
                                    onChange={(treks) => updateField('treks', treks)}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-800">
                    {step > 1 ? (
                        <button
                            type="button"
                            onClick={prevStep}
                            className="flex items-center text-gray-400 hover:text-white transition-colors font-medium"
                        >
                            <ChevronLeft className="w-5 h-5 mr-1" />
                            Back
                        </button>
                    ) : (
                        <div></div>
                    )}

                    {step < 3 ? (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                nextStep();
                            }}
                            disabled={isChecking}
                            className={`bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-lg transition-all flex items-center ${isChecking ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isChecking ? 'Checking...' : 'Next Step'}
                            {!isChecking && <ChevronRight className="w-5 h-5 ml-1" />}
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg transition-all flex items-center shadow-lg hover:shadow-green-500/20"
                        >
                            Complete Registration
                            <CheckCircle className="w-5 h-5 ml-2" />
                        </button>
                    )}
                </div>
            </form>

            <PasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                onSubmit={handleFinalSubmit}
            />
        </div>
    );
};

export default GuideRegistrationWizard;
