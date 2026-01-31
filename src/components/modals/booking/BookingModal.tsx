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
    user_id: z.string().optional()
});

export type BookingSchemaType = z.infer<typeof bookingSchema>;

// Only exporting for legacy compatibility if strict types needed elsewhere, 
// but preferred usage is inferred schema
export interface BookingFormData extends BookingSchemaType { }

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    trekTitle: string;
    onSubmit: (formData: BookingFormData) => Promise<boolean>;
}

const BookingModal: React.FC<BookingModalProps> = ({
    isOpen,
    onClose,
    trekTitle,
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
                setValue('name', user.user_metadata.full_name || '');
                setValue('email', user.email || '');
                setValue('user_id', user.id);
            } else {
                reset({ name: '', email: '', phone: '', date: '', guests: 1 });
            }

            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen, user, setValue, reset]);

    const onFormSubmit = async (data: BookingFormData) => {
        setSubmitError('');
        try {
            // Strip space from phone number before submission to match backend expectation
            const cleanData = {
                ...data,
                phone: data.phone.replace(/\s/g, '')
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-[200]">
            <div
                ref={modalContentRef}
                className="bg-white w-full sm:w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl transform transition-all duration-300 ease-out relative overflow-hidden flex flex-col max-h-[90vh]"
                role="dialog"
                aria-modal="true"
            >
                {/* Header */}
                {step === 'form' && (
                    <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 bg-gray-50">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                Request Availability
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">For <span className="font-semibold text-yellow-600">{trekTitle}</span></p>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                            <HiX className="w-6 h-6 text-gray-500" />
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            disabled={!!user}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors ${errors.name ? 'border-red-500' : 'border-gray-300'} ${user ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
                                            placeholder="John Doe"
                                            {...register('name')}
                                        />
                                    </div>
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="email"
                                                disabled={!!user}
                                                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors ${errors.email ? 'border-red-500' : 'border-gray-300'} ${user ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
                                                placeholder="john@example.com"
                                                {...register('email')}
                                            />
                                        </div>
                                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <div className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm border-r border-gray-300 pr-2 mr-2">
                                                +91
                                            </div>
                                            <input
                                                type="tel"
                                                maxLength={11}
                                                className={`w-full pl-[4.5rem] pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
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
                                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-gray-100 my-4" />

                            {/* Trip Details */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Approx. Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                        <input
                                            type="date"
                                            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors ${errors.date ? 'border-red-500' : 'border-gray-300'} appearance-none`}
                                            min={new Date().toISOString().split('T')[0]} // JSON date string format YYYY-MM-DD
                                            {...register('date')}
                                        />
                                    </div>
                                    {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                                    <div className="relative">
                                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="number"
                                            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors ${errors.guests ? 'border-red-500' : 'border-gray-300'}`}
                                            {...register('guests', { valueAsNumber: true })}
                                        />
                                    </div>
                                    {errors.guests && <p className="text-red-500 text-xs mt-1">{errors.guests.message}</p>}
                                </div>
                            </div>

                            {submitError && (
                                <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
                                    {submitError}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
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
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-10 h-10 text-green-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Received!</h3>
                            <p className="text-gray-600 mb-8 max-w-xs mx-auto">
                                Thanks!
                                <br />
                                We have received your request and will contact you soon.
                            </p>
                            <button
                                onClick={onClose}
                                className="bg-gray-900 text-white font-semibold py-3 px-8 rounded-xl hover:bg-gray-800 transition-colors"
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
