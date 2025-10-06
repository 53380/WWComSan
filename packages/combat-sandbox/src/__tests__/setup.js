import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

const raf = (cb) => setTimeout(() => cb(Date.now()), 16);

beforeAll(() => {
  vi.stubGlobal('requestAnimationFrame', raf);
  vi.stubGlobal('cancelAnimationFrame', (id) => clearTimeout(id));
});

afterAll(() => {
  vi.unstubAllGlobals();
});
