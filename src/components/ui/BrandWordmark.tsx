import { BRAND_WORDMARK } from '@/lib/brand';

interface BrandWordmarkProps {
    className?: string;
    variant?: 'web' | 'email';
}

const BrandWordmark = ({ className = 'text-2xl', variant = 'web' }: BrandWordmarkProps) => {
    const isEmail = variant === 'email';

    return (
        <span
            className={isEmail ? undefined : `font-display tracking-normal text-white ${className}`}
            style={isEmail ? {
                fontFamily: "'Instrument Serif', Georgia, 'Times New Roman', serif",
                fontSize: '28px',
                fontWeight: 400,
                color: '#ffffff',
                letterSpacing: 'normal',
                verticalAlign: 'middle',
            } : undefined}
        >
            {BRAND_WORDMARK.primary}<span
                className={isEmail ? undefined : 'text-yellow-400'}
                style={isEmail ? { color: '#facc15' } : undefined}
            >{BRAND_WORDMARK.accent}</span>
        </span>
    );
};

export default BrandWordmark;
