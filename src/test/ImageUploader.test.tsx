import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ImageUploader from '../../components/ImageUploader';

describe('ImageUploader', () => {
  const mockOnImageUpload = vi.fn();
  const mockOnImageRemove = vi.fn();
  const mockOnUploadError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders upload area when no image is selected', () => {
    render(
      <ImageUploader
        onImageUpload={mockOnImageUpload}
        onImageRemove={mockOnImageRemove}
        onUploadError={mockOnUploadError}
        imageFile={null}
      />
    );

    expect(screen.getByText('Click to upload')).toBeInTheDocument();
    expect(screen.getByText('PNG, JPG or WEBP')).toBeInTheDocument();
  });

  it('renders image preview when image is selected', () => {
    const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
    
    render(
      <ImageUploader
        onImageUpload={mockOnImageUpload}
        onImageRemove={mockOnImageRemove}
        onUploadError={mockOnUploadError}
        imageFile={mockFile}
      />
    );

    expect(screen.getByAltText('Uploaded preview')).toBeInTheDocument();
  });

  it('calls onUploadError for invalid file types', () => {
    render(
      <ImageUploader
        onImageUpload={mockOnImageUpload}
        onImageRemove={mockOnImageRemove}
        onUploadError={mockOnUploadError}
        imageFile={null}
      />
    );

    const fileInput = screen.getByLabelText('Upload an image');
    const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' });

    fireEvent.change(fileInput, { target: { files: [invalidFile] } });

    expect(mockOnUploadError).toHaveBeenCalledWith(
      'Invalid file type. Please upload a PNG, JPG, or WEBP image.'
    );
  });

  it('calls onUploadError for files that are too large', () => {
    render(
      <ImageUploader
        onImageUpload={mockOnImageUpload}
        onImageRemove={mockOnImageRemove}
        onUploadError={mockOnUploadError}
        imageFile={null}
      />
    );

    const fileInput = screen.getByLabelText('Upload an image');
    // Create a mock file that's larger than 10MB
    const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.png', { type: 'image/png' });
    Object.defineProperty(largeFile, 'size', { value: 11 * 1024 * 1024 });

    fireEvent.change(fileInput, { target: { files: [largeFile] } });

    expect(mockOnUploadError).toHaveBeenCalledWith(
      expect.stringContaining('File is too large')
    );
  });

  it('processes valid files correctly', () => {
    render(
      <ImageUploader
        onImageUpload={mockOnImageUpload}
        onImageRemove={mockOnImageRemove}
        onUploadError={mockOnUploadError}
        imageFile={null}
      />
    );

    const fileInput = screen.getByLabelText('Upload an image');
    const validFile = new File(['test'], 'test.png', { type: 'image/png' });

    fireEvent.change(fileInput, { target: { files: [validFile] } });

    // The FileReader mock should trigger onImageUpload
    expect(mockOnImageUpload).toHaveBeenCalledWith(
      'data:image/png;base64,mockbase64data',
      validFile
    );
  });

  it('calls onImageRemove when remove button is clicked', () => {
    const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
    
    render(
      <ImageUploader
        onImageUpload={mockOnImageUpload}
        onImageRemove={mockOnImageRemove}
        onUploadError={mockOnUploadError}
        imageFile={mockFile}
      />
    );

    const removeButton = screen.getByText('Remove Image');
    fireEvent.click(removeButton);

    expect(mockOnImageRemove).toHaveBeenCalled();
  });

  it('handles drag and drop events', () => {
    render(
      <ImageUploader
        onImageUpload={mockOnImageUpload}
        onImageRemove={mockOnImageRemove}
        onUploadError={mockOnUploadError}
        imageFile={null}
      />
    );

    const dropZone = screen.getByText('Click to upload').closest('div');
    const validFile = new File(['test'], 'test.png', { type: 'image/png' });

    fireEvent.dragEnter(dropZone!);
    fireEvent.drop(dropZone!, {
      dataTransfer: {
        files: [validFile]
      }
    });

    expect(mockOnImageUpload).toHaveBeenCalledWith(
      'data:image/png;base64,mockbase64data',
      validFile
    );
  });
});
