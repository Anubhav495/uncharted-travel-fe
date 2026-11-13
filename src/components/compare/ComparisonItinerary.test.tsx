import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ComparisonItinerary from './ComparisonItinerary';

const days = [
    { day: 0, title: 'Arrive at base camp', description: 'Meet the guide and settle into camp.', meals: 'Dinner' },
    { day: 1, title: 'Walk to the meadow', description: 'Follow the river through the forest.', distance: 'Trek Distance: 5 km', elevation: 'Altitude: 2,800 m' },
];

function openItinerary() {
    fireEvent.click(screen.getByText('View itinerary · 2 days listed'));
}

it('opens first to day headings and expands each day independently', () => {
    render(<ComparisonItinerary days={days} />);
    const outer = screen.getByText('View itinerary · 2 days listed').closest('details')!;
    expect(outer).not.toHaveAttribute('open');
    openItinerary();
    const arrival = screen.getByRole('button', { name: 'Day 0 Arrive at base camp' });
    const walk = screen.getByRole('button', { name: 'Day 1 Walk to the meadow' });
    expect(arrival).toHaveAttribute('aria-expanded', 'false');
    expect(walk).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText(days[0].description)).not.toBeVisible();
    expect(screen.getByText(days[1].description)).not.toBeVisible();

    fireEvent.click(arrival);
    expect(arrival).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(days[0].description)).toBeVisible();
    expect(screen.getByText(days[1].description)).not.toBeVisible();
    expect(outer).toHaveAttribute('open');
    fireEvent.click(arrival);
    expect(screen.getByText(days[0].description)).not.toBeVisible();
});

it('expands and collapses every day, including after one day was opened individually', () => {
    render(<ComparisonItinerary days={days} />);
    openItinerary();
    fireEvent.click(screen.getByRole('button', { name: 'Day 0 Arrive at base camp' }));
    fireEvent.click(screen.getByRole('button', { name: 'Expand all' }));
    expect(screen.getByText(days[0].description)).toBeVisible();
    expect(screen.getByText(days[1].description)).toBeVisible();
    expect(screen.getByText('5 km')).toBeVisible();
    expect(screen.getByText('2,800 m')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Collapse all' })).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Collapse all' }));
    expect(screen.getByText(days[0].description)).not.toBeVisible();
    expect(screen.getByText(days[1].description)).not.toBeVisible();
    expect(screen.getByRole('button', { name: 'Expand all' })).toHaveAttribute('aria-expanded', 'false');
});

it('keeps bulk controls scoped to their own package', () => {
    render(<><ComparisonItinerary days={days} /><ComparisonItinerary days={[{ day: 1, title: 'Different route', description: 'Another provider route.' }]} /></>);
    openItinerary();
    fireEvent.click(screen.getByText('View itinerary · 1 day listed'));
    fireEvent.click(screen.getAllByRole('button', { name: 'Expand all' })[0]);
    expect(screen.getByText(days[0].description)).toBeVisible();
    expect(screen.getByText('Another provider route.')).not.toBeVisible();
});

it('preserves unknown day labels and explains a day without additional information', () => {
    render(<ComparisonItinerary days={[{ day: null, title: 'Provider stage' }]} />);
    fireEvent.click(screen.getByText('View itinerary · 1 day listed'));
    fireEvent.click(screen.getByRole('button', { name: 'Day not stated Provider stage' }));
    expect(screen.getByText('No additional details stated for this day.')).toBeVisible();
});
