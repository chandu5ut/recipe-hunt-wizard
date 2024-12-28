const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com/recipes';

interface ComplexSearchParams {
  query?: string;
  cuisine?: string;
  ingredients?: string[];
}

export const generateRecipesSuggestions = async ({ query, cuisine, ingredients }: ComplexSearchParams) => {
  const apiKey = localStorage.getItem('SPOONACULAR_API_KEY');
  
  if (!apiKey) {
    throw new Error('Spoonacular API key is required');
  }

  let url: string;
  
  if (ingredients && ingredients.length > 0) {
    // Use findByIngredients endpoint if ingredients are provided
    const ingredientsString = ingredients.join(',+');
    url = `${SPOONACULAR_BASE_URL}/findByIngredients?apiKey=${apiKey}&ingredients=${ingredientsString}&number=6&ranking=2&ignorePantry=true`;
  } else {
    // Use complexSearch endpoint for query/cuisine search
    const params = new URLSearchParams({
      apiKey,
      number: '6',
    });
    
    if (query) params.append('query', query);
    if (cuisine) params.append('cuisine', cuisine);
    
    url = `${SPOONACULAR_BASE_URL}/complexSearch?${params.toString()}`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch recipes');
  }

  const data = await response.json();
  
  // Handle different response structures from different endpoints
  if (ingredients && ingredients.length > 0) {
    return data.map((recipe: any) => ({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      usedIngredients: recipe.usedIngredients.map((ing: any) => ing.original),
      missedIngredients: recipe.missedIngredients.map((ing: any) => ing.original),
    }));
  } else {
    return data.results.map((recipe: any) => ({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      usedIngredients: [],
      missedIngredients: [],
    }));
  }
};