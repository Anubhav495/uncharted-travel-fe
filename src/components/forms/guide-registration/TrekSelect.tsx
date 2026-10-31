import React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

const POPULAR_TREKS = [
    "Kedarkantha Trek",
    "Roopkund Trek",
    "Hampta Pass Trek",
    "Baraadsar Lake Trek",
    "Valley of Flowers",
    "Triund Trek",
    "Chadar Trek",
    "Har Ki Dun",
    "Kashmir Great Lakes",
    "Goechala Trek",
    "Sandakphu Trek",
    "Brahmatal Trek",
    "Rupin Pass Trek",
    "Dayara Bugyal",
    "Nag Tibba",
    "Kheerganga Trek"
];

interface TrekSelectProps {
    selectedTreks: string[];
    onChange: (treks: string[]) => void;
}

const TrekSelect: React.FC<TrekSelectProps> = ({ selectedTreks, onChange }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleTrek = (trek: string) => {
        if (selectedTreks.includes(trek)) {
            onChange(selectedTreks.filter(t => t !== trek));
        } else {
            onChange([...selectedTreks, trek]);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <label className="block text-xs font-sans uppercase tracking-wider text-slate-300 mb-1.5 font-medium">
                Which treks do you guide?
            </label>

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-slate-900/90 border border-slate-700 py-3 px-4 text-left text-white focus:outline-none focus:border-yellow-400 flex justify-between items-center text-sm font-sans"
            >
                <span className="block truncate text-slate-200">
                    {selectedTreks.length === 0
                        ? "Select treks..."
                        : `${selectedTreks.length} trek${selectedTreks.length > 1 ? 's' : ''} selected`
                    }
                </span>
                <ChevronsUpDown className="w-4 h-4 text-slate-400" />
            </button>

            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-slate-800 border border-slate-700 shadow-2xl max-h-60 overflow-auto divide-y divide-slate-700/50">
                    {POPULAR_TREKS.map((trek) => (
                        <div
                            key={trek}
                            onClick={() => toggleTrek(trek)}
                            className="cursor-pointer select-none relative py-3 pl-10 pr-4 hover:bg-slate-700 text-slate-200 text-sm font-sans"
                        >
                            <span className={`block truncate ${selectedTreks.includes(trek) ? 'font-medium text-yellow-400' : 'font-normal'}`}>
                                {trek}
                            </span>
                            {selectedTreks.includes(trek) && (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-yellow-400">
                                    <Check className="w-4 h-4" />
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Selected Tags */}
            <div className="flex flex-wrap gap-2 mt-3">
                {selectedTreks.map(trek => (
                    <span key={trek} className="inline-flex items-center px-3 py-1 text-xs font-medium bg-yellow-400/10 text-yellow-400 border border-yellow-400/30 font-sans">
                        {trek}
                        <button
                            type="button"
                            onClick={() => toggleTrek(trek)}
                            className="ml-2 hover:text-yellow-200 focus:outline-none text-sm leading-none"
                        >
                            &times;
                        </button>
                    </span>
                ))}
            </div>
        </div>
    );
};

export default TrekSelect;
