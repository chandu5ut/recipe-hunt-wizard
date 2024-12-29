const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com/recipes';

interface SearchParams {
  ingredients?: string[];
}

export const generateRecipesSuggestions = async ({ ingredients }: SearchParams) => {
  const apiKey = localStorage.getItem('SPOONACULAR_API_KEY');
  
  if (!apiKey) {
    throw new Error('Spoonacular API key is required');
  }

  if (!ingredients || ingredients.length === 0) {
    throw new Error('Ingredients are required');
  }

  const ingredientsString = ingredients.join(',+');
  const url = `${SPOONACULAR_BASE_URL}/findByIngredients?apiKey=${apiKey}&ingredients=${ingredientsString}&number=6&ranking=2&ignorePantry=true`;

  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    if (response.status === 401) {
      throw new Error('401: Invalid or expired API key');
    }
    throw new Error(`Failed to fetch recipes: ${errorData.message || response.statusText}`);
  }

  const data = await response.json();
  
  return data.map((recipe: any) => ({
    id: recipe.id,
    title: recipe.title,
    image: recipe.image,
    usedIngredients: recipe.usedIngredients.map((ing: any) => ing.original),
    missedIngredients: recipe.missedIngredients.map((ing: any) => ing.original),
  }));
};