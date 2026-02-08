// Create Group Modal - Form to create a new trip group

import React, { useState } from 'react';
import { X, Calendar, Users, Lock, Globe, Loader2 } from 'lucide-react';
import { treks } from '@/data/treks';
import { CreateGroupInput } from '@/types/community';
import { useCommunity } from '@/context/CommunityContext';
import { getMaxGroupSize } from '@/lib/levels';

interface CreateGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (input: CreateGroupInput) => Promise<void>;
    preselectedTrek?: string;
}

export default function CreateGroupModal({
    isOpen,
    onClose,
    onSubmit,
    preselectedTrek,
}: CreateGroupModalProps) {
    const { profile } = useCommunity();
    const maxGroupSize = profile ? getMaxGroupSize(profile.level) : 10;

    const [formData, setFormData] = useState<CreateGroupInput>({
        trek_slug: preselectedTrek || '',
        trek_title: '',
        title: '',
        description: '',
        planned_date: '',
        flexible_dates: false,
        max_members: maxGroupSize,
        is_public: true,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleTrekChange = (slug: string) => {
        const trek = treks.find(t => t.slug === slug);
        setFormData(prev => ({
            ...prev,
            trek_slug: slug,
            trek_title: trek?.title || '',
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.trek_slug || !formData.title || !formData.planned_date) {
            setError('Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (err) {
            setError('Failed to create group. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-slate-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-slate-700">
                {/* Header */}
                <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Create a Trip Group</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    {/* Trek Selection */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">
                            Select Trek *
                        </label>
                        <select
                            value={formData.trek_slug}
                            onChange={e => handleTrekChange(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none"
                            required
                        >
                            <option value="">Choose a trek...</option>
                            {treks.map(trek => (
                                <option key={trek.slug} value={trek.slug}>
                                    {trek.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Group Title */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">
                            Group Title *
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="e.g., Weekend Warrior Trek to Sar Pass"
                            className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none"
                            required
                            maxLength={100}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Tell potential members about your trip plans, experience level expectations, etc."
                            rows={3}
                            className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none resize-none"
                            maxLength={500}
                        />
                    </div>

                    {/* Date */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                <Calendar className="w-4 h-4 inline mr-1" />
                                Planned Date *
                            </label>
                            <input
                                type="date"
                                value={formData.planned_date}
                                onChange={e => setFormData(prev => ({ ...prev, planned_date: e.target.value }))}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                <Users className="w-4 h-4 inline mr-1" />
                                Max Members
                            </label>
                            <input
                                type="number"
                                value={formData.max_members}
                                onChange={e => setFormData(prev => ({ ...prev, max_members: Math.min(maxGroupSize, parseInt(e.target.value) || 2) }))}
                                min={2}
                                max={maxGroupSize}
                                className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none"
                            />
                        </div>
                    </div>

                    {/* Toggles */}
                    <div className="flex flex-col gap-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.flexible_dates}
                                onChange={e => setFormData(prev => ({ ...prev, flexible_dates: e.target.checked }))}
                                className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-yellow-500 focus:ring-yellow-500"
                            />
                            <span className="text-sm text-slate-300">
                                Dates are flexible (± a few days)
                            </span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={!formData.is_public}
                                onChange={e => setFormData(prev => ({ ...prev, is_public: !e.target.checked }))}
                                className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-yellow-500 focus:ring-yellow-500"
                            />
                            <div className="flex items-center gap-2">
                                {formData.is_public ? (
                                    <Globe className="w-4 h-4 text-green-400" />
                                ) : (
                                    <Lock className="w-4 h-4 text-yellow-400" />
                                )}
                                <span className="text-sm text-slate-300">
                                    Private group (invite only)
                                </span>
                            </div>
                        </label>
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="text-red-400 text-sm">{error}</p>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 disabled:bg-yellow-600 disabled:cursor-not-allowed rounded-lg font-semibold text-slate-900 transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            'Create Group'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
