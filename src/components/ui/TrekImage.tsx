import Image, { ImageProps } from 'next/image';
import { Mountain } from 'lucide-react';

const TrekImage = ({ src, alt, ...props }: ImageProps) => {
    if (!src) {
        return (
            <div
                role="img"
                aria-label={`${alt || 'Trek'}: photos coming soon`}
                className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-800 text-slate-400"
            >
                <Mountain className="h-12 w-12 text-slate-500" aria-hidden="true" />
                <span className="px-2 text-center text-xs">Photos coming soon</span>
            </div>
        );
    }

    return <Image src={src} alt={alt} {...props} />;
};

export default TrekImage;
