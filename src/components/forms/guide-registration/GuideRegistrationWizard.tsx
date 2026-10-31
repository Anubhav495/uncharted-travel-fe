import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Upload, CheckCircle } from 'lucide-react';
import TrekSelect from './TrekSelect';
import { useToast } from '../../../context/ToastContext';
import { useAuth } from '../../../context/AuthContext';


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
    const { user, loginWithGoogle } = useAuth();
    const [step, setStep] = useState(1);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        trigger,
        watch,
        setValue,
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
    }, [setValue]);

    // Auto-save to localStorage whenever formData changes
    useEffect(() => {
        const subscription = watch((value) => {
            localStorage.setItem('guideRegistrationDraft', JSON.stringify(value));
        });
        return () => subscription.unsubscribe();
    }, [watch]);

    // Prefill with user data if available
    useEffect(() => {
        if (user) {
            const currentFullName = getValues('fullName');
            const currentEmail = getValues('email');
            
            if (!currentFullName && user.user_metadata?.full_name) {
                setValue('fullName', user.user_metadata.full_name);
            }
            if (!currentEmail && user.email) {
                setValue('email', user.email);
            }
        }
    }, [user, setValue, getValues]);

    const nextStep = async () => {
        let isValid = false;

        if (step === 1) {
            isValid = await trigger(['fullName', 'email', 'phone']);
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

    const onSubmit = async (data: GuideFormData) => {
        if (step !== 3) return;
        if (!user) {
            await loginWithGoogle(window.location.href);
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/registerGuide', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const responseData = await response.json();
            if (!response.ok) throw new Error(responseData.message || 'Unable to submit application');

            setIsSuccess(true);

            // Clear saved draft after successful submission
            localStorage.removeItem('guideRegistrationDraft');
            localStorage.removeItem('guideRegistrationStep');

            // Redirect after 3 seconds
            setTimeout(() => {
                router.push('/');
            }, 3000);

        } catch (error) {
            console.error('Registration Error:', error);
            showToast(error instanceof Error ? error.message : 'Unable to submit application.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="max-w-2xl mx-auto text-center py-12">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/80 p-12 shadow-2xl flex flex-col items-center"
                >
                    <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-6">
                        <CheckCircle className="w-10 h-10 text-emerald-400" />
                    </div>
                    <h2 className="text-3xl font-display font-normal text-white mb-4">Application Submitted!</h2>
                    <p className="text-slate-300 text-lg mb-2 font-sans">
                        Your application is currently under review.
                    </p>
                    <p className="text-slate-400 text-sm mb-8 font-sans">
                        We will send you an email once your profile has been approved. Redirecting you to the home page...
                    </p>
                    <div className="w-full bg-slate-700 h-1.5 max-w-xs overflow-hidden">
                        <motion.div
                            className="h-full bg-yellow-400"
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
                <div className="flex justify-between text-xs font-sans uppercase tracking-wider text-slate-400 mb-2 font-medium">
                    <span className={step >= 1 ? "text-yellow-400 font-semibold" : ""}>Account</span>
                    <span className={step >= 2 ? "text-yellow-400 font-semibold" : ""}>Profile</span>
                    <span className={step >= 3 ? "text-yellow-400 font-semibold" : ""}>Experience</span>
                </div>
                <div className="h-1 bg-slate-800 overflow-hidden border border-slate-700/50">
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
                className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/80 p-6 sm:p-10 shadow-2xl"
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
                            <h2 className="text-2xl font-display font-normal text-white mb-6">Let's get you started</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-sans uppercase tracking-wider text-slate-300 mb-1.5 font-medium">Full Name</label>
                                    <input
                                        type="text"
                                        className={`w-full bg-slate-900/90 border ${errors.fullName ? 'border-rose-500' : 'border-slate-700'} px-4 py-3 text-white placeholder-slate-500 focus:border-yellow-400 outline-none transition-all text-sm font-sans`}
                                        placeholder="e.g. Rahul Sharma"
                                        {...register('fullName')}
                                    />
                                    {errors.fullName && (
                                        <p className="text-rose-400 text-xs mt-1 font-sans">{errors.fullName.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-sans uppercase tracking-wider text-slate-300 mb-1.5 font-medium">Email Address</label>
                                    <input
                                        type="email"
                                        className={`w-full bg-slate-900/90 border ${errors.email ? 'border-rose-500' : 'border-slate-700'} px-4 py-3 text-white placeholder-slate-500 focus:border-yellow-400 outline-none transition-all text-sm font-sans`}
                                        placeholder="rahul@example.com"
                                        {...register('email')}
                                    />
                                    {errors.email && (
                                        <p className="text-rose-400 text-xs mt-1 font-sans">{errors.email.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-sans uppercase tracking-wider text-slate-300 mb-1.5 font-medium">Phone Number</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium border-r border-slate-700 pr-3 text-sm font-sans">
                                            +91
                                        </div>
                                        <input
                                            type="tel"
                                            className={`w-full bg-slate-900/90 border ${errors.phone ? 'border-rose-500' : 'border-slate-700'} pl-16 pr-4 py-3 text-white placeholder-slate-500 focus:border-yellow-400 outline-none transition-all text-sm font-sans`}
                                            placeholder="98765 43210"
                                            {...register('phone')}
                                        />
                                    </div>
                                    {errors.phone && (
                                        <p className="text-rose-400 text-xs mt-1 font-sans">{errors.phone.message}</p>
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
                            <h2 className="text-2xl font-display font-normal text-white mb-6">Where are you based?</h2>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-sans uppercase tracking-wider text-slate-300 mb-1.5 font-medium">City</label>
                                        <input
                                            type="text"
                                            className={`w-full bg-slate-900/90 border ${errors.city ? 'border-rose-500' : 'border-slate-700'} px-4 py-3 text-white placeholder-slate-500 focus:border-yellow-400 outline-none transition-all text-sm font-sans`}
                                            placeholder="e.g. Manali"
                                            {...register('city')}
                                        />
                                        {errors.city && (
                                            <p className="text-rose-400 text-xs mt-1 font-sans">{errors.city.message}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-sans uppercase tracking-wider text-slate-300 mb-1.5 font-medium">State</label>
                                        <input
                                            type="text"
                                            className={`w-full bg-slate-900/90 border ${errors.state ? 'border-rose-500' : 'border-slate-700'} px-4 py-3 text-white placeholder-slate-500 focus:border-yellow-400 outline-none transition-all text-sm font-sans`}
                                            placeholder="e.g. Himachal Pradesh"
                                            {...register('state')}
                                        />
                                        {errors.state && (
                                            <p className="text-rose-400 text-xs mt-1 font-sans">{errors.state.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-sans uppercase tracking-wider text-slate-300 mb-2 font-medium">Profile Photo</label>
                                    <div className="border border-dashed border-slate-700 hover:border-yellow-400/60 p-8 text-center transition-colors cursor-pointer bg-slate-900/50">
                                        <div className="w-12 h-12 bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-3 text-yellow-400">
                                            <Upload className="w-5 h-5" />
                                        </div>
                                        <p className="text-sm text-slate-200 font-medium font-sans">Click to upload or drag and drop</p>
                                        <p className="text-xs text-slate-400 mt-1 font-sans">SVG, PNG, JPG or GIF (max. 800x400px)</p>
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
                            <h2 className="text-2xl font-display font-normal text-white mb-6">Your Expertise</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-sans uppercase tracking-wider text-slate-300 mb-1.5 font-medium">Years of Experience</label>
                                    <select
                                        className={`w-full bg-slate-900/90 border ${errors.yearsExperience ? 'border-rose-500' : 'border-slate-700'} px-4 py-3 text-white focus:border-yellow-400 outline-none transition-all appearance-none text-sm font-sans`}
                                        {...register('yearsExperience')}
                                    >
                                        <option value="">Select experience...</option>
                                        <option value="0-2">0-2 years</option>
                                        <option value="3-5">3-5 years</option>
                                        <option value="5-10">5-10 years</option>
                                        <option value="10+">10+ years</option>
                                    </select>
                                    {errors.yearsExperience && (
                                        <p className="text-rose-400 text-xs mt-1 font-sans">{errors.yearsExperience.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-sans uppercase tracking-wider text-slate-300 mb-1.5 font-medium">Languages Spoken</label>
                                    <input
                                        type="text"
                                        className={`w-full bg-slate-900/90 border ${errors.languages ? 'border-rose-500' : 'border-slate-700'} px-4 py-3 text-white placeholder-slate-500 focus:border-yellow-400 outline-none transition-all text-sm font-sans`}
                                        placeholder="e.g. English, Hindi, Pahari"
                                        {...register('languages')}
                                    />
                                    {errors.languages && (
                                        <p className="text-rose-400 text-xs mt-1 font-sans">{errors.languages.message}</p>
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
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-700/70">
                    {step > 1 ? (
                        <button
                            type="button"
                            onClick={prevStep}
                            className="flex items-center text-slate-400 hover:text-white transition-colors font-sans text-xs uppercase tracking-wider font-semibold cursor-pointer"
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" />
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
                            className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-sans text-xs uppercase tracking-widest font-bold py-3.5 px-8 transition-all flex items-center shadow-lg shadow-yellow-400/10 cursor-pointer"
                        >
                            Next Step
                            <ChevronRight className="w-4 h-4 ml-1.5" />
                        </button>
                    ) : (
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-sans text-xs uppercase tracking-widest font-bold py-3.5 px-8 transition-all flex items-center shadow-lg shadow-yellow-400/10 cursor-pointer disabled:opacity-50"
                        >
                            {isSubmitting ? 'Submitting...' : user ? 'Complete Registration' : 'Sign in & Complete'}
                            <CheckCircle className="w-4 h-4 ml-2" />
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default GuideRegistrationWizard;
