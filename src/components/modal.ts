import type { Recipe } from '../types/recipe';

export function setupModal() {
  const modal = document.getElementById('recipe-modal') as HTMLElement;
  const closeBtn = document.getElementById('close-modal-btn') as HTMLButtonElement;

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e: MouseEvent) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

export function openRecipeModal(recipe: Recipe) {
  const modal = document.getElementById('recipe-modal') as HTMLElement;
  const modalBody = document.getElementById('modal-body') as HTMLElement;

  modalBody.innerHTML = `
    <h2>${recipe.name}</h2>
    <img src="${recipe.image}" alt="${recipe.name}" style="width: 100%; height: 250px; object-fit: cover; border-radius: 8px; margin: 15px 0;" />
    
    <div style="display: flex; gap: 15px; margin-bottom: 15px; font-size: 0.95rem; color: #636e72;">
      <span>⏱ Час готування: ${recipe.prepTimeMinutes + recipe.cookTimeMinutes} хв</span>
      <span>🍽 Порцій: ${recipe.servings}</span>
      <span>⭐ Рейтинг: ${recipe.rating} (${recipe.reviewCount})</span>
    </div>

    <h3 style="margin-top: 15px; margin-bottom: 8px;">Інгредієнти:</h3>
    <ul style="padding-left: 20px; margin-bottom: 15px;">
      ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
    </ul>

    <h3 style="margin-top: 15px; margin-bottom: 8px;">Інструкція приготування:</h3>
    <ol style="padding-left: 20px;">
      ${recipe.instructions.map(step => `<li style="margin-bottom: 8px;">${step}</li>`).join('')}
    </ol>
  `;

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
}