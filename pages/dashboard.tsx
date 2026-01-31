
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../src/context/AuthContext';
import { supabase } from '../src/lib/supabaseClient';
import Link from 'next/link';
import { Calendar, Users, MapPin, Compass, ArrowRight, Clock, Edit2, X, Save, Award } from 'lucide-react';
import { HiStar } from 'react-icons/hi';
import { useToast } from '../src/context/ToastContext';
import ReviewModal from '@/components/modals/review/ReviewModal';

interface BookingRequest {
    id: string;
    created_at: string;
    trek_title: string;
    status: string;
    approx_date: string;
    guests: number;
    guide_id?: string;
}

interface Review {
    id: string;
    booking_id: string;
    rating: number;
    comment: string;
}

export default function Dashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { showToast } = useToast();
    const [bookings, setBookings] = useState<BookingRequest[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [fetching, setFetching] = useState(true);

    // Edit State
    const [editingBooking, setEditingBooking] = useState<BookingRequest | null>(null);
    const [editForm, setEditForm] = useState<{ date: string; guests: number | string }>({ date: '', guests: 1 });
    const [isUpdating, setIsUpdating] = useState(false);

    // Review State
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [selectedBookingForReview, setSelectedBookingForReview] = useState<BookingRequest | null>(null);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/');
        }
    }, [user, loading, router]);

    const fetchBookings = async () => {
        if (!user) return;
        try {
            const { data: bookingsData, error: bookingsError } = await supabase
                .from('booking_requests')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            const { data: reviewsData, error: reviewsError } = await supabase
                .from('reviews')
                .select('*')
                .eq('user_id', user.id);

            if (bookingsError || reviewsError) {
                console.error('Error fetching data:', bookingsError, reviewsError);
            } else {
                setBookings(bookingsData || []);
                setReviews(reviewsData || []);
            }
        } catch (err) {
            console.error('Unexpected error:', err);
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchBookings();
        }
    }, [user]);

    const handleEditClick = (booking: BookingRequest) => {
        setEditingBooking(booking);
        setEditForm({
            date: booking.approx_date || '',
            guests: booking.guests || 1
        });
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingBooking) return;
        setIsUpdating(true);

        try {
            const { error } = await supabase
                .from('booking_requests')
                .update({
                    approx_date: editForm.date,
                    guests: Number(editForm.guests) || 0
                })
                .eq('id', editingBooking.id);

            if (error) throw error;

            showToast('Booking updated successfully!', 'success');
            setEditingBooking(null);
            fetchBookings(); // Refresh list
        } catch (error) {
            console.error('Error updating booking:', error);
            showToast('Failed to update booking. Please try again.', 'error');
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading || (fetching && user)) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
            </div>
        );
    }

    if (!user) return null; // Redirecting

    return (
        <>
            <Head>
                <title>Dashboard | Uncharted Travel</title>
                <meta name="robots" content="noindex" />
            </Head>

            <div className="min-h-screen pt-24 pb-12 bg-slate-900 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 border-b border-slate-800 pb-8">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">My Dashboard</h1>
                            <p className="text-slate-400 text-lg">
                                Welcome back, <span className="text-yellow-400 font-medium">{user.user_metadata.full_name || user.email}</span>
                            </p>
                        </div>
                        <Link
                            href="/destinations"
                            className="mt-6 md:mt-0 flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-slate-900 px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg hover:shadow-yellow-400/20"
                        >
                            <Compass className="w-5 h-5" />
                            Explore New Treks
                        </Link>
                    </div>

                    {/* Content Section */}
                    <div className="space-y-6">
                        {/* Active Bookings Section */}
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Clock className="w-5 h-5 text-yellow-400" />
                                Recent Enquiries
                            </h2>
                            <span className="text-sm text-slate-500 bg-slate-800 px-3 py-1 rounded-full">
                                {bookings.filter(b => b.status !== 'completed').length} Request{bookings.filter(b => b.status !== 'completed').length !== 1 ? 's' : ''}
                            </span>
                        </div>

                        {bookings.filter(b => b.status !== 'completed').length === 0 ? (
                            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-12 text-center">
                                <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <MapPin className="w-8 h-8 text-slate-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">No active enquiries</h3>
                                <p className="text-slate-400 mb-8 max-w-sm mx-auto">
                                    You don't have any pending requests. Ready to start your next journey?
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {bookings.filter(b => b.status !== 'completed').map((booking) => (
                                    <div
                                        key={booking.id}
                                        className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-yellow-400/30 rounded-xl p-6 transition-all group"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">
                                                        {booking.trek_title}
                                                    </h3>
                                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider
                                          ${booking.status === 'confirmed' ? 'bg-green-500/20 text-green-400 border border-green-500/20' :
                                                            booking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/20' :
                                                                'bg-slate-700 text-slate-300 border border-slate-600'}`}>
                                                        {booking.status}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                                                    <span className="flex items-center gap-1.5">
                                                        <Calendar className="w-4 h-4" />
                                                        {booking.approx_date || 'Date TBD'}
                                                    </span>
                                                    <span className="w-1 h-1 bg-slate-600 rounded-full hidden sm:block" />
                                                    <span className="flex items-center gap-1.5">
                                                        <Users className="w-4 h-4" />
                                                        {booking.guests} Guest{booking.guests !== 1 ? 's' : ''}
                                                    </span>
                                                    <span className="w-1 h-1 bg-slate-600 rounded-full hidden sm:block" />
                                                    <span>
                                                        Submitted {new Date(booking.created_at.split(/[Z+]/)[0]).toLocaleDateString('en-GB', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-end gap-3">
                                                <div className="text-slate-500 text-sm italic hidden sm:block">
                                                    We'll contact you soon
                                                </div>
                                                <button
                                                    onClick={() => handleEditClick(booking)}
                                                    className="p-2 text-slate-400 hover:text-yellow-400 hover:bg-slate-700 rounded-lg transition-colors"
                                                    title="Edit Booking"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Completed Bookings Section */}
                        {bookings.filter(b => b.status === 'completed').length > 0 && (
                            <>
                                <div className="flex items-center justify-between pt-8 border-t border-slate-800 mt-8">
                                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                        <Award className="w-5 h-5 text-green-400" />
                                        Past Adventures
                                    </h2>
                                    <span className="text-sm text-slate-500 bg-slate-800 px-3 py-1 rounded-full">
                                        {bookings.filter(b => b.status === 'completed').length} Completed
                                    </span>
                                </div>

                                <div className="grid gap-4">
                                    {bookings.filter(b => b.status === 'completed').map((booking) => (
                                        <div
                                            key={booking.id}
                                            className="bg-slate-800/30 border border-slate-800 rounded-xl p-6 transition-all group"
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="text-xl font-bold text-slate-300 group-hover:text-white transition-colors">
                                                            {booking.trek_title}
                                                        </h3>
                                                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-green-900/30 text-green-400 border border-green-500/20">
                                                            Completed
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                                                        <span className="flex items-center gap-1.5">
                                                            <Calendar className="w-4 h-4" />
                                                            {booking.approx_date || 'Date TBD'}
                                                        </span>
                                                        <span className="w-1 h-1 bg-slate-700 rounded-full hidden sm:block" />
                                                        <span className="flex items-center gap-1.5">
                                                            <Users className="w-4 h-4" />
                                                            {booking.guests} Guest{booking.guests !== 1 ? 's' : ''}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-end gap-3">
                                                    {booking.guide_id ? (
                                                        <button
                                                            onClick={() => {
                                                                setSelectedBookingForReview(booking);
                                                                setIsReviewModalOpen(true);
                                                            }}
                                                            className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-bold transition-all ${reviews.some(r => r.booking_id === booking.id)
                                                                ? 'bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400 hover:text-slate-900'
                                                                : 'bg-yellow-400 text-slate-900 hover:bg-yellow-500 shadow-md hover:shadow-yellow-400/20'
                                                                }`}
                                                        >
                                                            <HiStar className="w-4 h-4" />
                                                            {reviews.some(r => r.booking_id === booking.id) ? 'Edit Review' : 'Rate Guide'}
                                                        </button>
                                                    ) : (
                                                        <span className="text-xs text-red-400 border border-red-400/30 px-2 py-1 rounded bg-red-400/10 dark:text-red-400">
                                                            Guide info missing
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Edit Modal */}
                {editingBooking && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white">Edit Booking</h3>
                                <button
                                    onClick={() => setEditingBooking(null)}
                                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Approx. Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                        <input
                                            type="text"
                                            value={editForm.date}
                                            onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                                            className="w-full bg-slate-900 border border-slate-700 text-white pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors"
                                            placeholder="e.g. May 2024"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Guests</label>
                                    <div className="relative">
                                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                        <input
                                            type="number"
                                            min="0"
                                            max="20"
                                            value={editForm.guests}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setEditForm({ ...editForm, guests: val === '' ? '' : parseInt(val) });
                                            }}
                                            className="w-full bg-slate-900 border border-slate-700 text-white pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all mt-6"
                                >
                                    {isUpdating ? 'Updating...' : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Review Modal */}
                {isReviewModalOpen && selectedBookingForReview && (
                    <ReviewModal
                        isOpen={isReviewModalOpen}
                        onClose={() => {
                            setIsReviewModalOpen(false);
                            setSelectedBookingForReview(null);
                        }}
                        bookingId={selectedBookingForReview.id}
                        trekTitle={selectedBookingForReview.trek_title}
                        existingReview={reviews.find(r => r.booking_id === selectedBookingForReview.id)}
                        onReviewSubmitted={() => {
                            fetchBookings(); // Refresh to ensure review state is updated
                        }}
                    />
                )}
            </div>
        </>
    );
}
