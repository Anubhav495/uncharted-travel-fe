import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Upload, CheckCircle } from 'lucide-react';
import TrekSelect from './TrekSelect';
import PasswordModal from '../../modals/registration/PasswordModal';
import { supabase } from '../../../lib/supabaseClient';
import { useToast } from '../../../context/ToastContext';


const guideSchema = z.object({
    fullName: z.string().min(1, 'Full name is required'),
    email: z.string().email('Invalid email address'),
    // countryCode field removed, implied +91
    phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    yearsExperience: z.string().min(1, 'Please select experience'),
    languages: z.string().min(1, 'Languages are required'),
    treks: z.array(z.string()),
});

type GuideFormData = z.infer<typeof guideSchema>;

const GuideRegistrationWizard: React.FC = () => {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isChecking, setIsChecking] = useState(false);

    const {
        register,
        handleSubmit,
        trigger,
        watch,
        setValue,
        setError,
        getValues,
        formState: { errors }
    } = useForm<GuideFormData>({
        resolver: zodResolver(guideSchema),
        defaultValues: {
            fullName: '',
            email: '',
            phone: '',
            city: '',
            state: '',
            yearsExperience: '',
            languages: '',
            treks: []
        },
        mode: 'onChange'
    });

    const formData = watch();

    // Restore saved progress from localStorage on mount
    useEffect(() => {
        const savedData = localStorage.getItem('guideRegistrationDraft');
        const savedStep = localStorage.getItem('guideRegistrationStep');

        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                // Set form values from local storage
                Object.keys(parsed).forEach((key) => {
                    // Skip countryCode since we removed it
                    if (key !== 'countryCode') {
                        setValue(key as any, parsed[key]);
                    }
                });
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
        const subscription = watch((value) => {
            localStorage.setItem('guideRegistrationDraft', JSON.stringify(value));
        });
        return () => subscription.unsubscribe();
    }, [watch]);

    const nextStep = async () => {
        let isValid = false;

        if (step === 1) {
            isValid = await trigger(['fullName', 'email', 'phone']);
            if (isValid) {
                setIsChecking(true);
                try {
                    // Check for duplicate email or phone
                    const { data, error } = await supabase
                        .from('guides')
                        .select('email, phone')
                        .or(`email.eq.${formData.email},phone.eq.${formData.phone}`);

                    if (error) {
                        console.error("Error checking duplicates:", error);
                    }

                    if (data && data.length > 0) {
                        let hasError = false;

                        // Check which one matched and set error
                        data.forEach(record => {
                            if (record.email === formData.email) {
                                setError('email', { type: 'manual', message: 'Email is already registered' });
                                hasError = true;
                            }
                            if (record.phone === formData.phone) {
                                setError('phone', { type: 'manual', message: 'Phone number is already registered' });
                                hasError = true;
                            }
                        });

                        if (hasError) {
                            setIsChecking(false);
                            return;
                        }
                    }
                } catch (err) {
                    console.error("Unexpected error checking duplicates:", err);
                } finally {
                    setIsChecking(false);
                }
            }
        } else if (step === 2) {
            isValid = await trigger(['city', 'state']);
        } else if (step === 3) {
            isValid = await trigger(['yearsExperience', 'languages']);
        }

        if (isValid) {
            setStep(prev => Math.min(prev + 1, 3));
        }
    };
    const { showToast } = useToast();
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const onSubmit = (data: GuideFormData) => {
        // Only show password modal on final step
        if (step === 3) {
            setIsPasswordModalOpen(true);
        }
    };

    const handleFinalSubmit = async (password: string) => {
        try {
            const finalData = { ...formData, password };

            // 1. Insert into guides table
            const { data: guideData, error: guideError } = await supabase
                .from('guides')
                .insert([
                    {
                        full_name: formData.fullName,
                        email: formData.email,
                        phone: formData.phone,
                        country_code: '+91', // Hardcoded as we only support Indian numbers
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
            showToast('Something went wrong. Please try again in sometime.', 'error');
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
                onSubmit={handleSubmit(onSubmit)}
                onKeyDown={(e) => {
                    // Prevent form submission via Enter key unless on final step
                    if (e.key === 'Enter' && step !== 3) {
                        e.preventDefault();
                    }
                }}
                className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-4 sm:p-8 shadow-2xl"
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
                                        {...register('fullName')}
                                    />
                                    {errors.fullName && (
                                        <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        className={`w-full bg-gray-800 border ${errors.email ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-yellow-400/50 focus:border-transparent outline-none transition-all`}
                                        placeholder="rahul@example.com"
                                        {...register('email')}
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium border-r border-gray-600 pr-3">
                                            +91
                                        </div>
                                        <input
                                            type="tel"
                                            className={`w-full bg-gray-800 border ${errors.phone ? 'border-red-500' : 'border-gray-700'} rounded-lg pl-16 pr-4 py-3 text-white focus:ring-2 focus:ring-yellow-400/50 focus:border-transparent outline-none transition-all`}
                                            placeholder="98765 43210"
                                            {...register('phone')}
                                        />
                                    </div>
                                    {errors.phone && (
                                        <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
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
                                <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">City</label>
                                        <input
                                            type="text"
                                            className={`w-full bg-gray-800 border ${errors.city ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-yellow-400/50 focus:border-transparent outline-none transition-all`}
                                            placeholder="e.g. Manali"
                                            {...register('city')}
                                        />
                                        {errors.city && (
                                            <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">State</label>
                                        <input
                                            type="text"
                                            className={`w-full bg-gray-800 border ${errors.state ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-yellow-400/50 focus:border-transparent outline-none transition-all`}
                                            placeholder="e.g. Himachal Pradesh"
                                            {...register('state')}
                                        />
                                        {errors.state && (
                                            <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
                                        )}
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
                                        className={`w-full bg-gray-800 border ${errors.yearsExperience ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-yellow-400/50 focus:border-transparent outline-none transition-all appearance-none`}
                                        {...register('yearsExperience')}
                                    >
                                        <option value="">Select experience...</option>
                                        <option value="0-2">0-2 years</option>
                                        <option value="3-5">3-5 years</option>
                                        <option value="5-10">5-10 years</option>
                                        <option value="10+">10+ years</option>
                                    </select>
                                    {errors.yearsExperience && (
                                        <p className="text-red-500 text-sm mt-1">{errors.yearsExperience.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Languages Spoken</label>
                                    <input
                                        type="text"
                                        className={`w-full bg-gray-800 border ${errors.languages ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-yellow-400/50 focus:border-transparent outline-none transition-all`}
                                        placeholder="e.g. English, Hindi, Pahari"
                                        {...register('languages')}
                                    />
                                    {errors.languages && (
                                        <p className="text-red-500 text-sm mt-1">{errors.languages.message}</p>
                                    )}
                                </div>

                                <TrekSelect
                                    selectedTreks={formData.treks || []}
                                    onChange={(treks) => setValue('treks', treks)}
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
