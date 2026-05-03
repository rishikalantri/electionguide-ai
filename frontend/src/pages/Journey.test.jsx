import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Journey from './Journey';
import { LanguageProvider } from '../context/LanguageContext';

// Mock Language Context
vi.mock('../context/LanguageContext', () => ({
  useLanguage: () => ({ currentLanguage: 'en', translate: vi.fn(text => text) }),
  LanguageProvider: ({ children }) => <div>{children}</div>
}));

describe('Election Journey Timeline Rendering', () => {
  it('renders the timeline data and first step correctly', () => {
    render(
      <LanguageProvider>
        <Journey />
      </LanguageProvider>
    );
    
    // Check main title
    expect(screen.getByText('The Election Journey')).toBeInTheDocument();
    
    // Check timeline list items (desktop/sidebar)
    expect(screen.getAllByText('Registration')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Electoral Roll')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Results')[0]).toBeInTheDocument();

    // Check active content area for the first step
    expect(screen.getByText(/The first step is to register as a voter./)).toBeInTheDocument();
  });
});
