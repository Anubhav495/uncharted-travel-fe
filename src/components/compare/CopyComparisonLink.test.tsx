import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import CopyComparisonLink from './CopyComparisonLink';

const writeText = jest.fn();
const originalClipboard = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
beforeEach(() => {
    writeText.mockReset();
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
});
afterEach(() => {
    if (originalClipboard) Object.defineProperty(navigator, 'clipboard', originalClipboard);
    else Reflect.deleteProperty(navigator, 'clipboard');
});

it('copies an absolute link for the current selection and confirms successful copying', async () => {
    writeText.mockResolvedValue(undefined);
    render(<CopyComparisonLink trekSlug="hampta-pass" providerIds={['indiahikes', 'trek-the-himalayas']} />);
    fireEvent.click(screen.getByRole('button', { name: 'Copy comparison link' }));
    expect(await screen.findByRole('status')).toHaveTextContent('Link copied.');
    expect(writeText).toHaveBeenCalledWith(`${window.location.origin}/compare?trek=hampta-pass&providers=trek-the-himalayas%2Cindiahikes`);
});

it.each(['denied', 'unavailable'])('offers a selectable manual link if clipboard access is %s', async (mode) => {
    if (mode === 'denied') writeText.mockRejectedValue(new Error('Clipboard blocked'));
    else Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined });
    render(<CopyComparisonLink trekSlug="hampta-pass" providerIds={['indiahikes']} />);
    fireEvent.click(screen.getByRole('button', { name: 'Copy comparison link' }));
    const input = await screen.findByRole('textbox', { name: 'Comparison link' });
    expect(input).toHaveValue(`${window.location.origin}/compare?trek=hampta-pass&providers=indiahikes`);
    fireEvent.focus(input);
    expect((input as HTMLInputElement).selectionEnd).toBe((input as HTMLInputElement).value.length);
    expect(screen.queryByText('Link copied.')).not.toBeInTheDocument();
});

it('disables sharing until a provider is chosen', () => {
    render(<CopyComparisonLink trekSlug="hampta-pass" providerIds={[]} />);
    expect(screen.getByRole('button', { name: 'Copy comparison link' })).toBeDisabled();
    expect(writeText).not.toHaveBeenCalled();
});

it('ignores clipboard feedback from a previous selection and copies the new selection', async () => {
    let finish!: () => void;
    writeText.mockReturnValueOnce(new Promise<void>((resolve) => { finish = resolve; })).mockResolvedValue(undefined);
    const view = render(<CopyComparisonLink trekSlug="hampta-pass" providerIds={['indiahikes']} />);
    fireEvent.click(screen.getByRole('button', { name: 'Copy comparison link' }));
    view.rerender(<CopyComparisonLink trekSlug="sar-pass-trek" providerIds={['trek-the-himalayas']} />);
    await act(async () => { finish(); });
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Copy comparison link' }));
    expect(await screen.findByRole('status')).toHaveTextContent('Link copied.');
    expect(writeText).toHaveBeenLastCalledWith(`${window.location.origin}/compare?trek=sar-pass-trek&providers=trek-the-himalayas`);
});
