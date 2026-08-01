import { NextApiRequest, NextApiResponse } from 'next';
import { sendReachOutEmail } from '@/lib/email';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, userName } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        await sendReachOutEmail(email, userName || 'Adventurer');
        return res.status(200).json({ message: 'Reach out email sent successfully' });
    } catch (error) {
        console.error('Failed to send reach out email:', error);
        return res.status(500).json({ error: 'Failed to send reach out email' });
    }
}
