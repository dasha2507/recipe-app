import type { RecipesResponse, Recipe } from '../types/recipe';

const BASE_URL = 'https://dummyjson.com/recipes';

export async function fetchRecipes(query: string = ''): Promise<Recipe[]> {
  let url = BASE_URL;
  if (query.trim() !== '') {
    url = `${BASE_URL}/search?q=${encodeURIComponent(query)}`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Помилка завантаження даних з сервера');
  }

  const data: RecipesResponse = await response.json();
  return data.recipes;
}

// Обов'язково має бути експорт перед цією функцією!
export async function fetchCategories(): Promise<string[]> {
  const response = await fetch(`${BASE_URL}/tags`);
  if (!response.ok) {
    throw new Error('Не вдалося завантажити категорії');
  }
  return response.json();
}