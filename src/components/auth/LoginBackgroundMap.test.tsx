import React from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import LoginBackgroundMap from './LoginBackgroundMap';

const mockMap = {
    flyTo: jest.fn(),
    on: jest.fn(),
    resize: jest.fn(),
    remove: jest.fn(),
};
const mockMarker = {
    setLngLat: jest.fn().mockReturnThis(),
    addTo: jest.fn().mockReturnThis(),
    remove: jest.fn(),
};

jest.mock('maplibre-gl', () => ({
    Map: jest.fn(() => mockMap),
    Marker: jest.fn(() => mockMarker),
    setWorkerUrl: jest.fn(),
}), { virtual: true });

describe('login map destination controls', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
    });

    it('keeps every mobile destination available and updates the summary when Kedarkantha is selected', () => {
        render(<LoginBackgroundMap />);
        const load = mockMap.on.mock.calls.find(([event]) => event === 'load')![1];
        act(() => load());

        const destinations = screen.getByRole('group', { hidden: true });
        const buttons = within(destinations).getAllByRole('button', { hidden: true });
        expect(buttons.map(button => button.textContent)).toEqual([
            'Kheerganga', 'Spiti', 'Kareri', 'Kedarkantha',
        ]);
        expect(buttons[0]).toHaveAttribute('aria-pressed', 'true');

        fireEvent.click(buttons[3]);
        act(() => jest.advanceTimersByTime(300));

        expect(buttons[3]).toHaveAttribute('aria-pressed', 'true');
        expect(buttons[0]).toHaveAttribute('aria-pressed', 'false');
        expect(within(destinations.parentElement!).getByText('12,500 ft')).toBeInTheDocument();
        expect(mockMap.flyTo).toHaveBeenCalledWith(expect.objectContaining({
            center: [78.1820, 31.0772],
        }));
    });
});
