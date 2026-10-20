import './style.css';
import { fetchRecipes, fetchCategories } from './api/recipesApi';
import { renderRecipes, showLoading, showError, clearStatus } from './components/ui';
import { setupModal } from './components/modal';
import type { Recipe } from './types/recipe';

let allRecipes: Recipe[] = [];

function setupTheme() {
  const themeBtn = document.createElement('button');
  themeBtn.id = 'theme-toggle';
  themeBtn.className = 'theme-btn-fixed';
  themeBtn.setAttribute('aria-label', 'Переключити тему');

  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeBtn.textContent = '☀️ Світла тема';
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    themeBtn.textContent = '🌙 Темна тема';
  }

  themeBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
      themeBtn.textContent = '🌙 Темна тема';
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      themeBtn.textContent = '☀️ Світла тема';
    }
  });

  document.body.appendChild(themeBtn);
}

async function initApp() {
  setupModal();
  setupTheme();
  
  const searchInput = document.getElementById('search-input') as HTMLInputElement;
  const categorySelect = document.getElementById('category-select') as HTMLSelectElement;

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

  await loadAndDisplayRecipes('');

  let searchTimeout: number;
  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = window.setTimeout(async () => {
      const query = searchInput.value;
      await loadAndDisplayRecipes(query);
    }, 300);
  });

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

document.addEventListener('DOMContentLoaded', initApp);