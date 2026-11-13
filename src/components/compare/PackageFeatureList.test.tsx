import React from 'react';
import { render, screen, within } from '@testing-library/react';
import PackageFeatureList from './PackageFeatureList';
import type { FieldMetadata } from '@/lib/competitors/types';

const evidence = { sourceUrl: 'https://trekthehimalayas.com/hampta-pass-trek', section: 'Inclusions', rawText: '', capturedAt: '2026-11-09' };

it('groups repeated source headings and preserves every condition and detail', () => {
    const items = [
        '1. Accommodation (as per the itinerary): Twin sharing tents.',
        '2. Support: Trek leader and local guide.',
        '2. Support: Support staff depending on group size.',
        'Please confirm arrival arrangements.',
    ];
    const metadata: FieldMetadata = { status: 'found', completeness: 'complete', evidence: [], items: items.map((text, index) => ({ text, assertion: index === 2 ? 'conditional' : 'included', evidence })) };
    render(<PackageFeatureList items={items} metadata={metadata} kind="inclusions" />);
    expect(screen.getAllByRole('heading', { name: 'Support' })).toHaveLength(1);
    expect(screen.getByRole('heading', { name: 'Accommodation (as per the itinerary)' })).toBeInTheDocument();
    expect(screen.getByText('Twin sharing tents.')).toBeInTheDocument();
    expect(screen.getByText('Support staff depending on group size.')).toBeInTheDocument();
    expect(screen.getByText('Conditional')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(4);
});

it('keeps negative and unconfirmed safety claims distinct from provided equipment', () => {
    const items = ['No oxygen support available.', 'Oxygen support mentioned.', 'First aid kit provided.'];
    const metadata: FieldMetadata = { status: 'found', completeness: 'complete', evidence: [], items: [
        { text: items[0], assertion: 'excluded', evidence },
        { text: items[1], assertion: 'mentioned', evidence },
        { text: items[2], assertion: 'included', evidence },
    ] };
    render(<PackageFeatureList items={items} metadata={metadata} kind="safety" />);
    const rows = screen.getAllByRole('listitem');
    expect(within(rows[0]).getByText('Provider note')).toBeInTheDocument();
    expect(within(rows[0]).getByText(items[0])).toBeInTheDocument();
    expect(within(rows[1]).getByText('Provision not confirmed')).toBeInTheDocument();
    expect(within(rows[2]).queryByText('Not provided')).not.toBeInTheDocument();
});

it('keeps source order and does not interpret time values as category headings', () => {
    render(<PackageFeatureList kind="exclusions" items={['Transport: Optional pickup.', 'Pickup at 06:00, weather permitting.', 'Transport: Return transfer charged separately.']} />);
    const rows = screen.getAllByRole('listitem');
    expect(rows.map((row) => row.textContent)).toEqual(['Optional pickup.', 'Pickup at 06:00, weather permitting.', 'Return transfer charged separately.']);
    expect(screen.getAllByRole('heading', { name: 'Transport' })).toHaveLength(2);
});

it('does not relabel carry instructions as a claim that supplied gear is excluded', () => {
    const text = 'Trekkers must carry their own sleeping liner, which will be issued at base camp.';
    const metadata: FieldMetadata = { status: 'found', completeness: 'complete', evidence: [], items: [{ text, assertion: 'excluded', evidence }] };
    render(<PackageFeatureList kind="inclusions" items={[text]} metadata={metadata} />);
    expect(screen.getByText(text)).toBeInTheDocument();
    expect(screen.getByText('Provider note')).toBeInTheDocument();
    expect(screen.queryByText('Not included')).not.toBeInTheDocument();
});
