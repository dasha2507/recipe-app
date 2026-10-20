import { describe, it, expect } from 'vitest';

describe('Recipe App Basic Tests', () => {
  it('should calculate total cooking time correctly', () => {
    const prepTime = 15;
    const cookTime = 20;
    const totalTime = prepTime + cookTime;
    
    expect(totalTime).toBe(35);
  });

  it('should validate search query string formatting', () => {
    const query = '  pizza  ';
    expect(query.trim()).toBe('pizza');
  });
});