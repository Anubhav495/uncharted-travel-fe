import React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

const POPULAR_TREKS = [
    "Kedarkantha Trek",
    "Roopkund Trek",
    "Hampta Pass Trek",
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

    const toggleTrek = (trek: string) => {
        if (selectedTreks.includes(trek)) {
            onChange(selectedTreks.filter(t => t !== trek));
        } else {
            onChange([...selectedTreks, trek]);
        }
    };

    return (
        <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-2">
                Which treks do you guide?
            </label>

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-left text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 flex justify-between items-center"
            >
                <span className="block truncate">
                    {selectedTreks.length === 0
                        ? "Select treks..."
                        : `${selectedTreks.length} trek${selectedTreks.length > 1 ? 's' : ''} selected`
                    }
                </span>
                <ChevronsUpDown className="w-4 h-4 text-gray-400" />
            </button>

            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-auto">
                    {POPULAR_TREKS.map((trek) => (
                        <div
                            key={trek}
                            onClick={() => toggleTrek(trek)}
                            className="cursor-pointer select-none relative py-3 pl-10 pr-4 hover:bg-gray-700 text-gray-200"
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
                    <span key={trek} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
                        {trek}
                        <button
                            type="button"
                            onClick={() => toggleTrek(trek)}
                            className="ml-2 hover:text-yellow-200 focus:outline-none"
                        >
                            ×
                        </button>
                    </span>
                ))}
            </div>
        </div>
    );
};

export default TrekSelect;
