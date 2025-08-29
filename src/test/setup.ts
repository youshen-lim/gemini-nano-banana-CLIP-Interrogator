import '@testing-library/jest-dom';

// Mock the clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(() => Promise.resolve()),
  },
});

// Mock FileReader
global.FileReader = class {
  result: string | ArrayBuffer | null = null;
  error: DOMException | null = null;
  readyState: number = 0;
  
  onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null = null;
  onerror: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null = null;
  onabort: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null = null;

  readAsDataURL(file: Blob) {
    this.readyState = 2;
    this.result = `data:${file.type};base64,mockbase64data`;
    if (this.onload) {
      this.onload({ target: this } as ProgressEvent<FileReader>);
    }
  }

  abort() {
    this.readyState = 2;
    if (this.onabort) {
      this.onabort({ target: this } as ProgressEvent<FileReader>);
    }
  }
} as any;

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'mock-object-url');
global.URL.revokeObjectURL = vi.fn();
