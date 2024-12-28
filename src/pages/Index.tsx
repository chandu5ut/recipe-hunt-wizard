import { useState } from "react";
import { IngredientInput } from "@/components/IngredientInput";
import { RecipeCard } from "@/components/RecipeCard";
import { Loader2 } from "lucide-react";
import { generateRecipesSuggestions } from "@/services/spoonacular";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem("SPOONACULAR_API_KEY") || "");
  const { toast } = useToast();

  const handleSubmit = async (ingredients: string[]) => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Spoonacular API key first.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const suggestions = await generateRecipesSuggestions(ingredients);
      setRecipes(suggestions);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch recipes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive",
      });
      return;
    }
    
    localStorage.setItem("SPOONACULAR_API_KEY", apiKey.trim());
    toast({
      title: "Success",
      description: "API key saved successfully!",
    });
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

        <div className="mb-8 max-w-md mx-auto">
          <div className="flex gap-2">
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Spoonacular API key"
              className="flex-1"
            />
            <Button onClick={handleSaveApiKey} variant="outline">
              Save Key
            </Button>
          </div>
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