import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ProviderSupportRequest from './ProviderSupportRequest';
import { useAuth } from '@/context/AuthContext';

jest.mock('@/context/AuthContext', () => ({ useAuth: jest.fn() }));
const originalFetch = global.fetch;
beforeEach(() => {
    global.fetch = jest.fn();
    jest.mocked(useAuth).mockReturnValue({ user: { email: 'trekker@example.com', user_metadata: {} }, loading: false } as any);
});
afterEach(() => { global.fetch = originalFetch; });

function openRequest() {
    render(<ProviderSupportRequest trekSlug="hampta-pass" />);
    fireEvent.click(screen.getByText('Request provider support'));
}
function fillRequest() {
    fireEvent.change(screen.getByRole('textbox', { name: 'Provider name' }), { target: { value: 'Himalayan Trails' } });
}

it('uses the existing sign-in flow for guest requests', () => {
    jest.mocked(useAuth).mockReturnValue({ user: null, loading: false } as any);
    openRequest();
    expect(screen.getByRole('link', { name: 'Sign in to request a provider' })).toHaveAttribute('href', '/login?returnUrl=%2Fcompare%3Ftrek%3Dhampta-pass%23provider-request');
    expect(global.fetch).not.toHaveBeenCalled();
});

it('submits a provider name and shows the saved confirmation', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true, status: 201, json: async () => ({}) });
    openRequest(); fillRequest();
    fireEvent.click(screen.getByRole('button', { name: 'Send provider request' }));
    expect(await screen.findByRole('status')).toHaveTextContent('Request saved');
    expect(global.fetch).toHaveBeenCalledWith('/api/requestProvider', expect.objectContaining({ body: JSON.stringify({ providerName: 'Himalayan Trails', notes: '', trekSlug: 'hampta-pass' }) }));
});

it('retains the form and its values if saving fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false, status: 503, json: async () => ({ message: 'Please try again later.' }) });
    openRequest(); fillRequest(); fireEvent.click(screen.getByRole('button', { name: 'Send provider request' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Please try again later.');
    expect(screen.getByRole('textbox', { name: 'Provider name' })).toHaveValue('Himalayan Trails');
    expect(screen.queryByText(/Request saved/)).not.toBeInTheDocument();
});

it('explains duplicate requests and expired sessions', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false, status: 409, json: async () => ({}) });
    openRequest(); fillRequest(); fireEvent.click(screen.getByRole('button', { name: 'Send provider request' }));
    expect(await screen.findByRole('status')).toHaveTextContent('already requested');
    fireEvent.click(screen.getByRole('button', { name: 'Request another provider' })); fillRequest();
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false, status: 401, json: async () => ({ message: 'Sign in to request a provider.' }) });
    fireEvent.click(screen.getByRole('button', { name: 'Send provider request' }));
    expect(await screen.findByRole('link', { name: 'Sign in again to send your request' })).toBeInTheDocument();
});

it('validates existing providers without sending a request', () => {
    openRequest(); fireEvent.change(screen.getByRole('textbox', { name: 'Provider name' }), { target: { value: 'Indiahikes' } });
    fireEvent.submit(screen.getByRole('form', { name: 'Request provider support' }));
    expect(screen.getByRole('alert')).toHaveTextContent('already supported'); expect(global.fetch).not.toHaveBeenCalled();
});

it('preserves supported provider choices through sign-in without copying unrelated URL data', () => {
    jest.mocked(useAuth).mockReturnValue({ user: null, loading: false } as any);
    render(<ProviderSupportRequest trekSlug="hampta-pass" providerIds={['trek-the-himalayas', 'indiahikes']} />);
    const href = screen.getByRole('link', { name: 'Sign in to request a provider' }).getAttribute('href')!;
    const returnUrl = new URL(href, window.location.origin).searchParams.get('returnUrl');
    expect(returnUrl).toBe('/compare?trek=hampta-pass&providers=trek-the-himalayas%2Cindiahikes#provider-request');
});
