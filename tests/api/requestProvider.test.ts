import type { NextApiRequest, NextApiResponse } from 'next';
import handler from '../../pages/api/requestProvider';
import { getAuthenticatedUser } from '@/lib/apiAuth';
import { getAdminSupabase } from '@/lib/adminSupabase';

jest.mock('@/lib/apiAuth', () => ({ getAuthenticatedUser: jest.fn() }));
jest.mock('@/lib/adminSupabase', () => ({ getAdminSupabase: jest.fn() }));
const insert = jest.fn(); const single = jest.fn();
beforeEach(() => {
    jest.resetAllMocks();
    jest.mocked(getAuthenticatedUser).mockResolvedValue({ id: 'signed-in-user', email: 'trekker@example.com', name: 'Trekker' });
    single.mockResolvedValue({ data: { id: 'saved-request' }, error: null });
    insert.mockReturnValue({ select: jest.fn().mockReturnValue({ single }) });
    jest.mocked(getAdminSupabase).mockReturnValue({ from: jest.fn().mockReturnValue({ insert }) } as any);
});

async function call(body: unknown = { providerName: '  Himalayan Trails  ', notes: 'Please add this provider.', trekSlug: 'hampta-pass' }, method = 'POST') {
    const res = { status: jest.fn(), json: jest.fn(), setHeader: jest.fn() }; res.status.mockReturnValue(res);
    await handler({ method, body } as NextApiRequest, res as unknown as NextApiResponse);
    return { status: res.status.mock.calls[0][0], body: res.json.mock.calls[0][0] };
}

it('saves a request for the authenticated user and returns success only after persistence', async () => {
    expect((await call()).status).toBe(201);
    expect(insert).toHaveBeenCalledWith({ user_id: 'signed-in-user', provider_name: 'Himalayan Trails', provider_key: 'himalayan trails', notes: 'Please add this provider.', trek_slug: 'hampta-pass' });
});

it('requires sign-in and rejects other HTTP methods without writing', async () => {
    expect((await call({}, 'GET')).status).toBe(405);
    jest.mocked(getAuthenticatedUser).mockResolvedValue(null); expect((await call()).status).toBe(401);
    expect(insert).not.toHaveBeenCalled();
});

it.each([
    { providerName: '', trekSlug: 'hampta-pass' },
    { providerName: '?!', trekSlug: 'hampta-pass' },
    { providerName: 'Indiahikes', trekSlug: 'hampta-pass' },
    { providerName: 'TTH', trekSlug: 'hampta-pass' },
    { providerName: 'Himalayan Trails', trekSlug: 'unknown' },
    { providerName: 'Himalayan Trails', notes: 'x'.repeat(1001), trekSlug: 'hampta-pass' },
    { providerName: 'Himalayan Trails', trekSlug: 'hampta-pass', user_id: 'another-user' },
])('rejects invalid or already-supported provider requests', async (body) => {
    expect((await call(body)).status).toBe(400); expect(insert).not.toHaveBeenCalled();
});

it('acknowledges an existing request without claiming a second request was created', async () => {
    single.mockResolvedValue({ data: null, error: { code: '23505' } });
    const response = await call(); expect(response.status).toBe(409); expect(response.body.message).toContain('already requested');
});

it('does not report success when the table or database is unavailable', async () => {
    single.mockResolvedValue({ data: null, error: { code: '42P01' } }); expect((await call()).status).toBe(503);
    jest.mocked(getAdminSupabase).mockImplementation(() => { throw new Error('Missing credentials'); });
    expect((await call()).status).toBe(503);
});
