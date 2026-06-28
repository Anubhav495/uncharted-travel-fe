import type { NextApiRequest, NextApiResponse } from 'next';
import submitBooking from '../../pages/api/submitBooking';
import submitReview from '../../pages/api/submitReview';
import { getAuthenticatedUser } from '@/lib/apiAuth';

jest.mock('@/lib/apiAuth', () => ({
    getAuthenticatedUser: jest.fn(),
}));

const mockedGetAuthenticatedUser = jest.mocked(getAuthenticatedUser);

function createResponse() {
    const response = {
        status: jest.fn(),
        json: jest.fn(),
        setHeader: jest.fn(),
    };
    response.status.mockReturnValue(response);
    response.json.mockReturnValue(response);
    return response as unknown as NextApiResponse;
}

describe('authenticated write APIs', () => {
    beforeEach(() => {
        mockedGetAuthenticatedUser.mockResolvedValue(null);
    });

    it.each([
        ['booking', submitBooking],
        ['review', submitReview],
    ])('rejects an unauthenticated %s submission', async (_name, handler) => {
        const response = createResponse();
        await handler({ method: 'POST', body: {} } as NextApiRequest, response);

        expect(response.status).toHaveBeenCalledWith(401);
        expect(response.json).toHaveBeenCalledWith({ message: 'Authentication required' });
    });
});
