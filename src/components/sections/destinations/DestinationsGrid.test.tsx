import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { useRouter } from 'next/router';
import DestinationsGrid from './DestinationsGrid';
import { treks } from '@/data/treks';

jest.mock('next/router', () => ({ useRouter: jest.fn() }));
jest.mock('next/image', () => ({
    __esModule: true,
    default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

it('keeps trek navigation available without advertising the removed guide and article pages', () => {
    const push = jest.fn();
    jest.mocked(useRouter).mockReturnValue({ push } as unknown as ReturnType<typeof useRouter>);

    render(<DestinationsGrid />);

    expect(screen.queryByRole('link', { name: /Meet Our Mountain Guides/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Route Guides & Cost Breakdowns/ })).not.toBeInTheDocument();
    expect(screen.getByText('More Himalayan destinations coming soon.')).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole('button', { name: 'View Trek' })[0]);
    expect(push).toHaveBeenCalledWith(`/destinations/${treks[0].slug}`);
});
