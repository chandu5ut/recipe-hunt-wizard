import { useState } from "react";
import { IngredientInput } from "@/components/IngredientInput";
import { RecipeCard } from "@/components/RecipeCard";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface Recipe {
  id: number;
  title: string;
  image: string;
  usedIngredients: { original: string }[];
  missedIngredients: { original: string }[];
}

const Index = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (ingredients: string[]) => {
    setLoading(true);
    try {
      // This is a mock API call - replace with your actual API endpoint
      const mockRecipes = [
        {
          id: 1,
          title: "Pasta with Garlic and Olive Oil",
          image: "https://spoonacular.com/recipeImages/pasta-garlic-olive-oil.jpg",
          usedIngredients: [
            { original: "Garlic" },
            { original: "Olive Oil" },
          ],
          missedIngredients: [
            { original: "Fresh Parsley" },
            { original: "Parmesan Cheese" },
          ],
        },
        {
          id: 2,
          title: "Simple Tomato Sauce",
          image: "https://spoonacular.com/recipeImages/tomato-sauce.jpg",
          usedIngredients: [
            { original: "Tomatoes" },
            { original: "Garlic" },
          ],
          missedIngredients: [
            { original: "Fresh Basil" },
            { original: "Red Pepper Flakes" },
          ],
        },
      ];

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setRecipes(mockRecipes);
      
      toast({
        title: "Recipes Found!",
        description: `Found ${mockRecipes.length} recipes with your ingredients.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch recipes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-recipe-secondary">
      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-recipe-text mb-4">
            Recipe Finder
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Enter your available ingredients and discover delicious recipes you can make!
          </p>
        </div>

        <IngredientInput onSubmit={handleSubmit} />

        {loading ? (
          <div className="flex justify-center items-center mt-12">
            <Loader2 className="h-8 w-8 animate-spin text-recipe-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;