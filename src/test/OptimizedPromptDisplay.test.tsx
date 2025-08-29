import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import OptimizedPromptDisplay from '../../components/OptimizedPromptDisplay';

describe('OptimizedPromptDisplay', () => {
  const mockOnChange = vi.fn();
  const testPrompt = 'This is a test prompt for image generation';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the prompt in a textarea', () => {
    render(
      <OptimizedPromptDisplay
        prompt={testPrompt}
        onChange={mockOnChange}
      />
    );

    const textarea = screen.getByLabelText('Optimized prompt input');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveValue(testPrompt);
  });

  it('calls onChange when text is modified', () => {
    render(
      <OptimizedPromptDisplay
        prompt={testPrompt}
        onChange={mockOnChange}
      />
    );

    const textarea = screen.getByLabelText('Optimized prompt input');
    const newText = 'Modified prompt text';
    
    fireEvent.change(textarea, { target: { value: newText } });

    expect(mockOnChange).toHaveBeenCalledWith(newText);
  });

  it('shows copy button', () => {
    render(
      <OptimizedPromptDisplay
        prompt={testPrompt}
        onChange={mockOnChange}
      />
    );

    const copyButton = screen.getByLabelText('Copy optimized prompt');
    expect(copyButton).toBeInTheDocument();
  });

  it('handles clipboard copy successfully', async () => {
    const mockWriteText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: { writeText: mockWriteText }
    });

    render(
      <OptimizedPromptDisplay
        prompt={testPrompt}
        onChange={mockOnChange}
      />
    );

    const copyButton = screen.getByLabelText('Copy optimized prompt');
    fireEvent.click(copyButton);

    expect(mockWriteText).toHaveBeenCalledWith(testPrompt);

    // Should show check icon briefly
    await waitFor(() => {
      expect(screen.getByTitle('Copy prompt')).toBeInTheDocument();
    });
  });

  it('handles clipboard copy failure gracefully', async () => {
    const mockWriteText = vi.fn().mockRejectedValue(new Error('Clipboard access denied'));
    Object.assign(navigator, {
      clipboard: { writeText: mockWriteText }
    });

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <OptimizedPromptDisplay
        prompt={testPrompt}
        onChange={mockOnChange}
      />
    );

    const copyButton = screen.getByLabelText('Copy optimized prompt');
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to copy text:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  it('uses fallback copy method when clipboard API is not available', async () => {
    // Mock document.execCommand
    const mockExecCommand = vi.fn().mockReturnValue(true);
    Object.assign(document, { execCommand: mockExecCommand });
    
    // Remove clipboard API
    Object.assign(navigator, { clipboard: undefined });

    render(
      <OptimizedPromptDisplay
        prompt={testPrompt}
        onChange={mockOnChange}
      />
    );

    const copyButton = screen.getByLabelText('Copy optimized prompt');
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(mockExecCommand).toHaveBeenCalledWith('copy');
    });
  });

  it('handles empty prompt', () => {
    render(
      <OptimizedPromptDisplay
        prompt=""
        onChange={mockOnChange}
      />
    );

    const textarea = screen.getByLabelText('Optimized prompt input');
    expect(textarea).toHaveValue('');
  });

  it('handles very long prompts', () => {
    const longPrompt = 'A'.repeat(1000);
    
    render(
      <OptimizedPromptDisplay
        prompt={longPrompt}
        onChange={mockOnChange}
      />
    );

    const textarea = screen.getByLabelText('Optimized prompt input');
    expect(textarea).toHaveValue(longPrompt);
  });
});
