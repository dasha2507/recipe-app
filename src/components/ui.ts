import type { Recipe } from '../types/recipe';
import { openRecipeModal } from './modal';

export function renderRecipes(recipes: Recipe[]) {
  const grid = document.getElementById('recipes-grid') as HTMLElement;
  
  if (recipes.length === 0) {
    grid.innerHTML = `<p class="status-message">Нічого не знайдено за вашим запитом.</p>`;
    return;
  }

  grid.innerHTML = recipes.map(recipe => `
    <article class="recipe-card" data-id="${recipe.id}">
      <img src="${recipe.image}" alt="${recipe.name}" class="recipe-image" loading="lazy" />
      <div class="recipe-content">
        <h2 class="recipe-title">${recipe.name}</h2>
        <div class="recipe-info">
          <span>⭐ ${recipe.rating}</span>
          <span>⏱ ${recipe.prepTimeMinutes + recipe.cookTimeMinutes} хв</span>
          <span>🔥 ${recipe.difficulty}</span>
        </div>
      </div>
    </article>
  `).join('');

  const cards = grid.querySelectorAll('.recipe-card');
  cards.forEach((card, index) => {
    card.addEventListener('click', () => {
      openRecipeModal(recipes[index]);
    });
  });
}

export function showLoading() {
  const statusContainer = document.getElementById('status-container') as HTMLElement;
  statusContainer.innerHTML = `<div class="status-message">Завантаження рецептів...</div>`;
  const grid = document.getElementById('recipes-grid');
  if (grid) grid.innerHTML = '';
}

export function showError(message: string) {
  const statusContainer = document.getElementById('status-container') as HTMLElement;
  statusContainer.innerHTML = `<div class="error-message">❌ ${message}</div>`;
}

// Ось ця функція обов'язково має бути з ключовим словом export!
export function clearStatus() {
  const statusContainer = document.getElementById('status-container') as HTMLElement;
  statusContainer.innerHTML = '';
}