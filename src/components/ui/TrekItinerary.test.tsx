import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import TrekItinerary from './TrekItinerary';
import { ItineraryDay } from '@/types/trek';

const itinerary: ItineraryDay[] = [
    {
        day: 1,
        title: 'Reach base camp',
        description: 'Walk through the forest to camp.',
        distance: '6 km',
        elevation: '2,400 m',
        meals: 'Lunch, Dinner',
    },
    {
        day: 2,
        title: 'Summit day',
        description: 'Climb to the summit before sunrise.',
    },
];

describe('TrekItinerary', () => {
    it('shows headings while mobile details start collapsed', () => {
        render(<TrekItinerary itinerary={itinerary} />);

        expect(screen.getByText('Reach base camp')).toBeVisible();
        expect(screen.getByText('Summit day')).toBeVisible();
        expect(screen.getByText('Walk through the forest to camp.').parentElement).toHaveClass('hidden');
        expect(screen.getByRole('button', { name: /Expand all/ })).toHaveAttribute('aria-expanded', 'false');
    });

    it('expands and collapses all itinerary details from one control', () => {
        render(<TrekItinerary itinerary={itinerary} />);

        fireEvent.click(screen.getByRole('button', { name: /Expand all/ }));

        expect(screen.getByText('Walk through the forest to camp.').parentElement).toHaveClass('block');
        expect(screen.getByText('Climb to the summit before sunrise.').parentElement).toHaveClass('block');
        expect(screen.getByRole('button', { name: /Collapse all/ })).toHaveAttribute('aria-expanded', 'true');

        fireEvent.click(screen.getByRole('button', { name: /Collapse all/ }));

        expect(screen.getByText('Walk through the forest to camp.').parentElement).toHaveClass('hidden');
    });
});
