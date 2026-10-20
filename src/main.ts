import './style.css';
import { fetchRecipes, fetchCategories } from './api/recipesApi';
import { renderRecipes, showLoading, showError, clearStatus } from './components/ui';
import { setupModal } from './components/modal';
import type { Recipe } from './types/recipe';

let allRecipes: Recipe[] = [];

async function initApp() {
  setupModal();
  
  const searchInput = document.getElementById('search-input') as HTMLInputElement;
  const categorySelect = document.getElementById('category-select') as HTMLSelectElement;

  // Завантаження категорій для фільтра
  try {
    const categories = await fetchCategories();
    categories.forEach(tag => {
      const option = document.createElement('option');
      option.value = tag;
      option.textContent = tag.charAt(0).toUpperCase() + tag.slice(1);
      categorySelect.appendChild(option);
    });
  } catch (e) {
    console.error('Не вдалося завантажити категорії', e);
  }

  // Завантаження початкових рецептів
  await loadAndDisplayRecipes('');

  // Пошук з дебаунсом (інтерактивний сценарій №2)
  let searchTimeout: number;
  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = window.setTimeout(async () => {
      const query = searchInput.value;
      await loadAndDisplayRecipes(query);
    }, 300);
  });

  // Фільтрація за категорією (інтерактивний сценарій №3)
  categorySelect.addEventListener('change', async () => {
    const selectedCategory = categorySelect.value;
    const query = searchInput.value;
    
    if (selectedCategory === '') {
      await loadAndDisplayRecipes(query);
    } else {
      try {
        showLoading();
        const response = await fetch(`https://dummyjson.com/recipes/tag/${selectedCategory}`);
        const data = await response.json();
        clearStatus();
        allRecipes = data.recipes;
        renderRecipes(allRecipes);
      } catch (err) {
        showError('Помилка фільтрації за категорією');
      }
    }
  });
}

async function loadAndDisplayRecipes(query: string = '') {
  try {
    showLoading();
    clearStatus();
    allRecipes = await fetchRecipes(query);
    clearStatus();
    renderRecipes(allRecipes);
  } catch (error) {
    showError('Сталася помилка при завантаженні даних. Перевірте підключення до інтернету.');
  }
}

// Запуск застосунку після завантаження DOM
document.addEventListener('DOMContentLoaded', initApp);