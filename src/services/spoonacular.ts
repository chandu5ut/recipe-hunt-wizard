const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com/recipes';

export const generateRecipesSuggestions = async (ingredients: string[]) => {
  const apiKey = localStorage.getItem('SPOONACULAR_API_KEY');
  
  if (!apiKey) {
    throw new Error('Spoonacular API key is required');
  }

  const ingredientsString = ingredients.join(',+');
  const url = `${SPOONACULAR_BASE_URL}/findByIngredients?apiKey=${apiKey}&ingredients=${ingredientsString}&number=6&ranking=2&ignorePantry=true`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch recipes');
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