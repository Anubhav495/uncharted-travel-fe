
import React, { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../src/context/AuthContext';
import Link from 'next/link';
import { Calendar, Users, MapPin, Compass, Clock, Edit2, X, Save, Award } from 'lucide-react';
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
    provider_id?: string;
    provider_type?: 'guide' | 'company';
    provider_name?: string; // Resolved on the client after fetch
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

    const fetchBookings = useCallback(async () => {
        if (!user) return;
        try {
            const response = await fetch('/api/dashboard');
            if (!response.ok) throw new Error('Unable to load dashboard');
            const data = await response.json();
            setBookings(data.bookings || []);
            setReviews(data.reviews || []);
        } catch (err) {
            console.error('Unexpected error:', err);
        } finally {
            setFetching(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchBookings();
        }
    }, [user, fetchBookings]);

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
            const response = await fetch('/api/dashboard', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookingId: editingBooking.id,
                    date: editForm.date,
                    guests: Number(editForm.guests),
                }),
            });
            if (!response.ok) throw new Error('Unable to update enquiry');

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

    const handleCancelClick = async (bookingId: string) => {
        if (!confirm('Are you sure you want to cancel this booking request?')) return;
        
        try {
            const response = await fetch('/api/dashboard', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookingId,
                    action: 'cancel'
                }),
            });
            if (!response.ok) throw new Error('Unable to cancel booking');
            
            showToast('Booking cancelled successfully', 'success');
            fetchBookings(); // Refresh list
        } catch (error) {
            console.error('Error cancelling booking:', error);
            showToast('Failed to cancel booking. Please try again.', 'error');
        }
    };

    if (loading || (fetching && user)) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
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

            <div className="min-h-screen pt-28 pb-20 bg-black text-white px-4 sm:px-6 lg:px-8 relative">
                {/* Ambient Topo Grid Lines */}
                <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />

                <div className="max-w-5xl mx-auto relative z-10">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 border-b border-white/10 pb-8 gap-6">
                        <div>
                            <div className="inline-block border border-white/15 px-2.5 py-0.5 bg-white/[0.03] text-[10px] font-sans uppercase tracking-widest text-white/60 mb-3">
                                Explorer Portal
                            </div>
                            <h1 className="font-display text-4xl sm:text-5xl font-normal text-white tracking-tight">
                                My Dashboard
                            </h1>
                            <p className="text-white/60 text-sm sm:text-base mt-2 font-sans">
                                Welcome back, <span className="font-display italic text-amber-400 text-lg sm:text-xl font-normal">{user.user_metadata.full_name || user.email}</span>
                            </p>
                        </div>
                        <Link
                            href="/destinations"
                            className="mt-4 md:mt-0 inline-flex items-center gap-2 px-5 py-3 border border-white/20 bg-white text-black hover:bg-neutral-200 transition-all text-xs uppercase tracking-widest font-sans font-medium shadow-lg"
                        >
                            <Compass className="w-4 h-4" />
                            <span>Explore New Treks</span>
                        </Link>
                    </div>

                    {/* Content Section */}
                    <div className="space-y-8">
                        {/* Active Bookings Section */}
                        <div className="flex items-center justify-between">
                            <h2 className="font-display text-2xl text-white font-normal flex items-center gap-2.5">
                                <Clock className="w-5 h-5 text-amber-400" />
                                <span>Recent Enquiries</span>
                            </h2>
                            <span className="text-xs font-sans text-white/50 border border-white/10 bg-white/[0.02] px-3 py-1 uppercase tracking-wider">
                                {bookings.filter(b => b.status === 'pending').length} Request{bookings.filter(b => b.status === 'pending').length !== 1 ? 's' : ''}
                            </span>
                        </div>

                        {bookings.filter(b => b.status === 'pending').length === 0 ? (
                            <div className="border border-white/10 bg-neutral-950/90 p-12 text-center">
                                <div className="w-14 h-14 border border-white/10 bg-white/[0.02] flex items-center justify-center mx-auto mb-4">
                                    <MapPin className="w-6 h-6 text-white/40" />
                                </div>
                                <h3 className="font-display text-2xl font-normal text-white mb-2">No active enquiries</h3>
                                <p className="text-white/50 text-xs sm:text-sm mb-6 max-w-sm mx-auto font-sans leading-relaxed">
                                    You don't have any pending trek bookings. Ready to explore untamed ridgelines with verified native masters?
                                </p>
                                <Link
                                    href="/destinations"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/25 bg-white/[0.04] text-white hover:bg-white hover:text-black transition-all text-xs uppercase tracking-widest font-sans font-medium"
                                >
                                    <span>Browse Himalayan Routes</span>
                                </Link>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {bookings.filter(b => b.status === 'pending').map((booking) => (
                                    <div
                                        key={booking.id}
                                        className="border border-white/10 bg-neutral-950/90 hover:border-white/25 p-6 sm:p-7 transition-all duration-200 group"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                    <h3 className="font-display text-2xl text-white group-hover:text-amber-400 transition-colors">
                                                        {booking.trek_title}
                                                    </h3>
                                                    <span className={`px-2.5 py-0.5 text-[10px] font-sans uppercase tracking-widest border ${
                                                        booking.status === 'pending'
                                                            ? 'bg-amber-400/10 text-amber-300 border-amber-400/30'
                                                            : 'bg-white/10 text-white/70 border-white/20'
                                                    }`}>
                                                        {booking.status}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-3.5 text-xs text-white/50 font-sans mt-2">
                                                    <span className="flex items-center gap-1.5 text-white/70">
                                                        <Calendar className="w-3.5 h-3.5 text-white/40" />
                                                        {booking.approx_date || 'Date TBD'}
                                                    </span>
                                                    <span className="w-1 h-1 bg-white/20 rounded-full hidden sm:block" />
                                                    <span className="flex items-center gap-1.5 text-white/70">
                                                        <Users className="w-3.5 h-3.5 text-white/40" />
                                                        {booking.guests} Guest{booking.guests !== 1 ? 's' : ''}
                                                    </span>
                                                    <span className="w-1 h-1 bg-white/20 rounded-full hidden sm:block" />
                                                    <span>
                                                        Submitted {new Date(booking.created_at.split(/[Z+]/)[0]).toLocaleDateString('en-GB', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                                {booking.provider_name && (
                                                    <div className="mt-3 flex items-center gap-2">
                                                        <span className="text-[10px] uppercase font-sans tracking-wider px-2 py-0.5 border border-white/10 bg-white/[0.03] text-white/60">
                                                            {booking.provider_type === 'company' ? 'Agency' : 'Native Master'}
                                                        </span>
                                                        <span className="text-xs font-sans text-white/80">{booking.provider_name}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5">
                                                {booking.status === 'pending' && (
                                                    <div className="text-white/40 text-xs italic font-sans mr-2">
                                                        Guide review in progress
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleEditClick(booking)}
                                                        className="p-2 text-white/60 hover:text-white hover:bg-white/10 border border-white/10 transition-colors"
                                                        title="Edit Booking"
                                                        aria-label="Edit Booking"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleCancelClick(booking.id)}
                                                        className="p-2 text-white/40 hover:text-rose-400 hover:bg-rose-500/10 border border-white/10 transition-colors"
                                                        title="Cancel Booking"
                                                        aria-label="Cancel Booking"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Completed Bookings Section */}
                        {bookings.filter(b => b.status === 'completed' || b.status === 'cancelled').length > 0 && (
                            <>
                                <div className="flex items-center justify-between pt-10 border-t border-white/10 mt-12">
                                    <h2 className="font-display text-2xl text-white font-normal flex items-center gap-2.5">
                                        <Award className="w-5 h-5 text-emerald-400" />
                                        <span>Past Expeditions</span>
                                    </h2>
                                    <span className="text-xs font-sans text-white/50 border border-white/10 bg-white/[0.02] px-3 py-1 uppercase tracking-wider">
                                        {bookings.filter(b => b.status === 'completed' || b.status === 'cancelled').length} Past
                                    </span>
                                </div>

                                <div className="grid gap-4">
                                    {bookings.filter(b => b.status === 'completed' || b.status === 'cancelled').map((booking) => (
                                        <div
                                            key={booking.id}
                                            className="border border-white/10 bg-neutral-950/80 p-6 sm:p-7 transition-all duration-200 group"
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                        <h3 className="font-display text-xl sm:text-2xl text-white/80 group-hover:text-white transition-colors">
                                                            {booking.trek_title}
                                                        </h3>
                                                        <span className={`px-2.5 py-0.5 text-[10px] font-sans uppercase tracking-widest border ${
                                                            booking.status === 'completed'
                                                                ? 'bg-emerald-400/10 text-emerald-300 border-emerald-400/30'
                                                                : 'bg-rose-400/10 text-rose-300 border-rose-400/30'
                                                        }`}>
                                                            {booking.status}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-3.5 text-xs text-white/40 font-sans mt-2">
                                                        <span className="flex items-center gap-1.5 text-white/60">
                                                            <Calendar className="w-3.5 h-3.5 text-white/30" />
                                                            {booking.approx_date || 'Date TBD'}
                                                        </span>
                                                        <span className="w-1 h-1 bg-white/20 rounded-full hidden sm:block" />
                                                        <span className="flex items-center gap-1.5 text-white/60">
                                                            <Users className="w-3.5 h-3.5 text-white/30" />
                                                            {booking.guests} Guest{booking.guests !== 1 ? 's' : ''}
                                                        </span>
                                                    </div>
                                                    {booking.provider_name && (
                                                        <div className="mt-3 flex items-center gap-2">
                                                            <span className="text-[10px] uppercase font-sans tracking-wider px-2 py-0.5 border border-white/10 bg-white/[0.03] text-white/50">
                                                                {booking.provider_type === 'company' ? 'Agency' : 'Native Master'}
                                                            </span>
                                                            <span className="text-xs font-sans text-white/70">{booking.provider_name}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-center justify-end gap-3 pt-3 sm:pt-0">
                                                    {booking.provider_id ? (
                                                        <button
                                                            onClick={() => {
                                                                setSelectedBookingForReview(booking);
                                                                setIsReviewModalOpen(true);
                                                            }}
                                                            className={`flex items-center gap-1.5 px-4 py-2 border text-xs font-sans uppercase tracking-wider transition-all ${
                                                                reviews.some(r => r.booking_id === booking.id)
                                                                    ? 'border-white/20 text-white/80 hover:bg-white hover:text-black'
                                                                    : 'border-amber-400/50 bg-amber-400/10 text-amber-300 hover:bg-amber-400 hover:text-black'
                                                            }`}
                                                        >
                                                            <HiStar className="w-3.5 h-3.5" />
                                                            <span>
                                                                {reviews.some(r => r.booking_id === booking.id)
                                                                    ? 'Edit Review'
                                                                    : `Review ${booking.provider_type === 'company' ? 'Company' : 'Guide'}`}
                                                            </span>
                                                        </button>
                                                    ) : (
                                                        <span className="text-xs text-white/30 italic font-sans">No guide assigned</span>
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
                    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
                        <div className="bg-neutral-950 border border-white/15 w-full max-w-md p-6 sm:p-8 shadow-2xl">
                            <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                                <h3 className="font-display text-2xl font-normal text-white">Edit Enquiry</h3>
                                <button
                                    onClick={() => setEditingBooking(null)}
                                    className="p-1.5 text-white/50 hover:text-white transition-colors"
                                    aria-label="Close"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-sans uppercase tracking-wider text-white/60 mb-1.5">Approximate Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                        <input
                                            type="text"
                                            value={editForm.date}
                                            onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                                            className="w-full bg-white/[0.04] border border-white/15 text-white pl-10 pr-4 py-3 text-sm outline-none focus:border-white/40 font-sans"
                                            placeholder="e.g. May 2025"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-sans uppercase tracking-wider text-white/60 mb-1.5">Number of Guests</label>
                                    <div className="relative">
                                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                        <input
                                            type="number"
                                            min="1"
                                            max="20"
                                            value={editForm.guests}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setEditForm({ ...editForm, guests: val === '' ? '' : parseInt(val) });
                                            }}
                                            className="w-full bg-white/[0.04] border border-white/15 text-white pl-10 pr-4 py-3 text-sm outline-none focus:border-white/40 font-sans"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="w-full mt-6 bg-white hover:bg-neutral-200 text-black py-3 text-xs uppercase tracking-widest font-sans font-medium flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50"
                                >
                                    {isUpdating ? 'Saving...' : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            <span>Save Changes</span>
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
