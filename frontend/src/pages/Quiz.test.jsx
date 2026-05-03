import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Quiz from './Quiz';
import axios from 'axios';

// Mock axios for score submission
vi.mock('axios');

describe('Quiz Component', () => {
  it('renders the first question correctly', () => {
    render(<Quiz />);
    expect(screen.getByText('What is the minimum age required to vote in India?')).toBeInTheDocument();
    expect(screen.getByText('18 years')).toBeInTheDocument();
  });

  it('calculates score correctly and shows results after all questions', async () => {
    axios.post.mockResolvedValue({ data: { message: 'Score saved' } });
    render(<Quiz />);
    
    // Total 10 questions. For a score of 2/10, we'll answer the first two correctly and the rest incorrectly.
    // Q1: What is the minimum age required to vote in India? (18 years -> index 1)
    fireEvent.click(screen.getByText('18 years'));
    fireEvent.click(screen.getByText('Next Question'));

    // Q2: Which form is used for registering as a new voter? (Form 6 -> index 0)
    fireEvent.click(screen.getByText('Form 6'));
    fireEvent.click(screen.getByText('Next Question'));

    // Answer incorrectly for the remaining 8 questions
    // We'll click an option that is definitely not the correct one based on quizData indices.
    const wrongIndices = [1, 0, 0, 1, 0, 0, 0, 0]; // Indices that are wrong for Q3 to Q10
    for (let i = 0; i < 8; i++) {
      const options = screen.getAllByRole('button').filter(btn => 
        !btn.textContent.includes('Next Question') && !btn.textContent.includes('View Results')
      );
      
      // For each question (Q3 to Q10), pick an option that is definitely wrong.
      // Q3 (i=0): Answer is 0. Pick options[1].
      // Q4 (i=1): Answer is 1. Pick options[0].
      // Q5 (i=2): Answer is 2. Pick options[0].
      // ... and so on.
      const correctIndexForThisQuestion = [0, 1, 2, 2, 1, 1, 2, 2][i];
      const indexToClick = correctIndexForThisQuestion === 0 ? 1 : 0;
      fireEvent.click(options[indexToClick]);
      
      const nextButton = screen.getByRole('button', { name: i === 7 ? /View Results/i : /Next Question/i });
      fireEvent.click(nextButton);
    }

    await waitFor(() => {
      expect(screen.getByText('Quiz Completed!')).toBeInTheDocument();
      // It should display a score of 2/10 as we answered first two correctly and rest incorrectly.
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('/ 10')).toBeInTheDocument();
    });
  });
});
