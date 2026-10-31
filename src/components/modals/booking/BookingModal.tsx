import React, { useState, useEffect, useRef } from 'react';
import { HiX } from 'react-icons/hi';
import { Calendar, Users, Mail, Phone, User, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { useAuth } from '@/context/AuthContext';

// Zod Schema for Validation
const bookingSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().regex(/^[6-9]\d{4}\s?\d{5}$/, 'Please enter a valid 10-digit Indian mobile number'),
    date: z.string().min(1, 'Approximate date is required'),
    guests: z.number().min(1, 'At least 1 guest required').max(20, 'Max 20 guests allowed'),
    bookingPreference: z.object({
        type: z.enum(['guide', 'company', 'general']),
        name: z.string().optional(),
        id: z.string().optional()
    }).optional()
});

export type BookingSchemaType = z.infer<typeof bookingSchema>;

// Only exporting for legacy compatibility if strict types needed elsewhere, 
// but preferred usage is inferred schema
export interface BookingFormData extends BookingSchemaType { }

export interface BookingPreference {
    type: 'guide' | 'company' | 'general';
    name?: string;
    id?: string;
}

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    trekTitle: string;
    bookingPreference?: BookingPreference;
    onSubmit: (formData: BookingFormData) => Promise<boolean>;
}

const BookingModal: React.FC<BookingModalProps> = ({
    isOpen,
    onClose,
    trekTitle,
    bookingPreference,
    onSubmit,
}) => {
    const { user } = useAuth();
    const [step, setStep] = useState<'form' | 'success'>('form');
    const [submitError, setSubmitError] = useState('');

    // React Hook Form Setup
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<BookingFormData>({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            date: '',
            guests: 1,
        },
        mode: 'onChange' // Proactive validation: Validate on every keystroke
    });

    const modalContentRef = useRef<HTMLDivElement>(null);

    // Effect to handle modal open state and pre-fill user data
    useEffect(() => {
        if (isOpen) {
            setStep('form');
            setSubmitError('');

            if (user) {
                const fullName = user.user_metadata?.full_name || '';
                const email = user.email || '';
                if (fullName) setValue('name', fullName, { shouldValidate: true });
                if (email) setValue('email', email, { shouldValidate: true });
            } else {
                reset({ name: '', email: '', phone: '', date: '', guests: 1 });
            }

            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen, user, setValue, reset]);

    // Keep fields synced if user session resolves after modal is open
    useEffect(() => {
        if (user && isOpen) {
            const fullName = user.user_metadata?.full_name || '';
            const email = user.email || '';
            if (fullName) setValue('name', fullName, { shouldValidate: true });
            if (email) setValue('email', email, { shouldValidate: true });
        }
    }, [user, isOpen, setValue]);

    const onFormSubmit = async (data: BookingFormData) => {
        setSubmitError('');
        try {
            // Strip space from phone number before submission to match backend expectation
            const cleanData = {
                ...data,
                phone: data.phone.replace(/\s/g, ''),
                bookingPreference: bookingPreference || { type: 'general' }
            };
            const success = await onSubmit(cleanData);
            if (success) {
                setStep('success');
                reset(); // Clear form on success
            }
        } catch (err) {
            console.error(err);
            setSubmitError('Something went wrong. Please try again.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-[200]">
            <div
                ref={modalContentRef}
                className="bg-slate-900 border border-slate-700 w-full sm:w-full sm:max-w-lg rounded-none shadow-2xl transform transition-all duration-300 ease-out relative overflow-hidden flex flex-col max-h-[90vh] text-white"
                role="dialog"
                aria-modal="true"
            >
                {/* Header */}
                {step === 'form' && (
                    <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-700 bg-slate-800/80">
                        <div>
                            <h2 className="text-xl font-bold text-white">
                                {bookingPreference?.type !== 'general' && bookingPreference?.name
                                    ? `Request with ${bookingPreference.name}`
                                    : 'Request Availability'}
                            </h2>
                            <p className="text-sm text-slate-300 mt-1">For <span className="font-semibold text-yellow-400">{trekTitle}</span></p>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-none hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
                            <HiX className="w-6 h-6" />
                        </button>
                    </div>
                )}

                {/* Body */}
                <div className="p-4 sm:p-6 overflow-y-auto">
                    {step === 'form' ? (
                        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
                            {/* Personal Details */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="text"
                                            disabled={Boolean(user?.user_metadata?.full_name)}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors bg-slate-800 text-white placeholder:text-slate-500 ${errors.name ? 'border-red-500' : 'border-slate-700'} ${user?.user_metadata?.full_name ? 'bg-slate-800/50 text-slate-400 cursor-not-allowed' : ''}`}
                                            placeholder="John Doe"
                                            {...register('name')}
                                        />
                                    </div>
                                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                type="email"
                                                disabled={Boolean(user?.email)}
                                                className={`w-full pl-10 pr-4 py-3 border rounded-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors bg-slate-800 text-white placeholder:text-slate-500 ${errors.email ? 'border-red-500' : 'border-slate-700'} ${user?.email ? 'bg-slate-800/50 text-slate-400 cursor-not-allowed' : ''}`}
                                                placeholder="john@example.com"
                                                {...register('email')}
                                            />
                                        </div>
                                        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Phone</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <div className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm border-r border-slate-700 pr-2 mr-2">
                                                +91
                                            </div>
                                            <input
                                                type="tel"
                                                maxLength={11}
                                                className={`w-full pl-[4.5rem] pr-4 py-3 border rounded-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors bg-slate-800 text-white placeholder:text-slate-500 ${errors.phone ? 'border-red-500' : 'border-slate-700'}`}
                                                placeholder="98765 43210"
                                                {...(() => {
                                                    const { onChange, ...rest } = register('phone');
                                                    return {
                                                        ...rest,
                                                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                                                            let val = e.target.value.replace(/[^\d]/g, '');
                                                            if (val.length > 5) {
                                                                val = val.slice(0, 5) + ' ' + val.slice(5, 10);
                                                            }
                                                            e.target.value = val;
                                                            onChange(e);
                                                        }
                                                    };
                                                })()}
                                            />
                                        </div>
                                        {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-slate-800 my-4" />

                            {/* Trip Details */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Approx. Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                                        <input
                                            type="date"
                                            className={`w-full pl-10 pr-4 py-3 border rounded-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors bg-slate-800 text-white ${errors.date ? 'border-red-500' : 'border-slate-700'} appearance-none`}
                                            min={new Date().toISOString().split('T')[0]}
                                            {...register('date')}
                                        />
                                    </div>
                                    {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Guests</label>
                                    <div className="relative">
                                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="number"
                                            className={`w-full pl-10 pr-4 py-3 border rounded-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors bg-slate-800 text-white placeholder:text-slate-500 ${errors.guests ? 'border-red-500' : 'border-slate-700'}`}
                                            {...register('guests', { valueAsNumber: true })}
                                        />
                                    </div>
                                    {errors.guests && <p className="text-red-400 text-xs mt-1">{errors.guests.message}</p>}
                                </div>
                            </div>

                            {submitError && (
                                <p className="text-red-400 text-sm bg-red-950/40 p-3 rounded-none border border-red-800">
                                    {submitError}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold py-4 px-6 rounded-none shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>Processing...</>
                                ) : (
                                    <>Check Availability</>
                                )}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-yellow-400/10 border border-yellow-400/30 rounded-none flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-8 h-8 text-yellow-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Request Received!</h3>
                            <p className="text-slate-300 mb-8 max-w-xs mx-auto">
                                Thanks!
                                <br />
                                We have received your request and will contact you soon.
                            </p>
                            <button
                                onClick={onClose}
                                className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-semibold py-3 px-8 rounded-none transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingModal;
