import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Checklist from './Checklist';

describe('Voter Checklist Rendering', () => {
  it('renders all checklist items correctly', () => {
    render(<Checklist />);
    
    expect(screen.getByText('Your Voter Checklist')).toBeInTheDocument();
    expect(screen.getByText('Register as a Voter')).toBeInTheDocument();
    expect(screen.getByText('Check Name in Electoral Roll')).toBeInTheDocument();
    expect(screen.getByText('Know Your Polling Station')).toBeInTheDocument();
    expect(screen.getByText('Carry Valid ID')).toBeInTheDocument();
    expect(screen.getByText('Follow Polling Booth Steps')).toBeInTheDocument();
  });

  it('updates progress when items are checked', () => {
    render(<Checklist />);
    
    const progressText = screen.getByText('0%');
    expect(progressText).toBeInTheDocument();
    
    // Check one item (1/5 = 20%)
    const registerItem = screen.getByText('Register as a Voter').closest('div').parentElement;
    fireEvent.click(registerItem);
    
    expect(screen.getByText('20%')).toBeInTheDocument();
  });
});
