import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import Community from '../../pages/community';
import { useAuth } from '@/context/AuthContext';
import { getLevelForXp } from '@/lib/levels';

jest.mock('@/context/AuthContext', () => ({ useAuth: jest.fn() }));
jest.mock('next-seo', () => ({ NextSeo: () => null }));

const originalFetch = global.fetch;
const leaderboard = Array.from({ length: 30 }, (_, index) => ({
    user_id: `user-${index + 1}`,
    display_name: `Explorer ${index + 1}`,
    avatar_url: null,
    xp_points: 1000 - index * 30,
    level: getLevelForXp(1000 - index * 30),
}));

beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ user: null });
    global.fetch = jest.fn().mockResolvedValue({
        json: async () => ({ leaderboard, currentUserRank: null }),
    });
});

afterEach(() => {
    global.fetch = originalFetch;
});

it('keeps the global rank when searching the redesigned leaderboard', async () => {
    render(<Community />);
    await screen.findByText('Explorer 17');
    fireEvent.change(screen.getByPlaceholderText('Search explorer by name...'), { target: { value: 'Explorer 17' } });
    const row = screen.getByText('Explorer 17').closest('.grid') as HTMLElement;
    expect(within(row).getByText('#17')).toBeInTheDocument();
    expect(screen.queryByText('Explorer 1')).not.toBeInTheDocument();
});

it('shows only the top 20 by default but searches the entire leaderboard', async () => {
    render(<Community />);
    await screen.findByText('Explorer 20');
    expect(screen.queryByText('Explorer 25')).not.toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText('Search explorer by name...'), { target: { value: 'Explorer 25' } });
    const row = screen.getByText('Explorer 25').closest('.grid') as HTMLElement;
    expect(within(row).getByText('#25')).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText('Search explorer by name...'), { target: { value: '' } });
    expect(screen.queryByText('Explorer 25')).not.toBeInTheDocument();
    expect(screen.getByText('Explorer 20')).toBeInTheDocument();
});

it('shows the server-calculated global rank even when the user is outside the public top 20', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: { id: 'outside-top-twenty' } });
    (global.fetch as jest.Mock).mockResolvedValue({
        json: async () => ({ leaderboard, currentUserRank: 29 }),
    });
    render(<Community />);
    await screen.findByText('#29');
    expect(screen.getByText('#29').parentElement).toHaveTextContent('Ranked #29 globally');
    expect(screen.queryByText(/out of 20 explorers/)).not.toBeInTheDocument();
});

it('describes the production XP rewards without advertising an unsupported altitude bonus', async () => {
    render(<Community />);
    await screen.findByText('Explorer 1');
    expect(screen.getByText('+250 XP')).toBeInTheDocument();
    expect(screen.getByText('+50 XP')).toBeInTheDocument();
    expect(screen.queryByText('+100 XP')).not.toBeInTheDocument();
});

it('shows the current explorer’s full name, rank, score, and You badge together', async () => {
    const currentExplorer = {
        ...leaderboard[5],
        display_name: 'Anubhav Kumar Srivastava',
    };
    (useAuth as jest.Mock).mockReturnValue({ user: { id: currentExplorer.user_id } });
    (global.fetch as jest.Mock).mockResolvedValue({
        json: async () => ({
            leaderboard: leaderboard.map(entry => entry.user_id === currentExplorer.user_id ? currentExplorer : entry),
            currentUserRank: 6,
        }),
    });

    render(<Community />);
    const name = await screen.findByText(currentExplorer.display_name);
    const row = within(name.closest('.grid') as HTMLElement);

    expect(row.getByText('#6')).toBeInTheDocument();
    expect(row.getByText('You')).toBeInTheDocument();
    expect(row.getByText(currentExplorer.xp_points.toLocaleString())).toBeInTheDocument();
    expect(screen.getAllByText('You')).toHaveLength(1);
});
