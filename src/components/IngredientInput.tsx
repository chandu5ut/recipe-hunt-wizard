import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface IngredientInputProps {
  onSubmit: (ingredients: string[]) => void;
}

interface Suggestion {
  name: string;
  image: string;
}

export const IngredientInput: React.FC<IngredientInputProps> = ({ onSubmit }) => {
  const [currentIngredient, setCurrentIngredient] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (currentIngredient.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      const apiKey = localStorage.getItem("SPOONACULAR_API_KEY");
      if (!apiKey) return;

      try {
        const response = await fetch(
          `https://api.spoonacular.com/food/ingredients/autocomplete?apiKey=${apiKey}&query=${currentIngredient}&number=5`
        );
        if (!response.ok) throw new Error("Failed to fetch suggestions");
        const data = await response.json();
        setSuggestions(
          data.map((item: any) => ({
            name: item.name,
            image: `https://spoonacular.com/cdn/ingredients_100x100/${item.image}`,
          }))
        );
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]); // Ensure suggestions is empty on error
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [currentIngredient]);

  const handleAddIngredient = (ingredient: string) => {
    if (ingredient.trim() && !ingredients.includes(ingredient.trim())) {
      setIngredients([...ingredients, ingredient.trim()]);
      setCurrentIngredient("");
      setOpen(false);
      toast({
        title: "Ingredient Added",
        description: `${ingredient} has been added to your list.`,
      });
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ingredients.length > 0) {
      onSubmit(ingredients);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={(e) => e.preventDefault()} className="mb-4">
        <div className="flex gap-2">
          <Popover open={open && suggestions.length > 0} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <div className="flex-1">
                <Input
                  type="text"
                  value={currentIngredient}
                  onChange={(e) => setCurrentIngredient(e.target.value)}
                  placeholder="Enter an ingredient..."
                  className="w-full"
                />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Search ingredients..." />
                <CommandEmpty>No ingredients found.</CommandEmpty>
                <CommandGroup>
                  {suggestions.map((suggestion) => (
                    <CommandItem
                      key={suggestion.name}
                      onSelect={() => handleAddIngredient(suggestion.name)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <img
                        src={suggestion.image}
                        alt={suggestion.name}
                        className="w-8 h-8 object-cover rounded"
                      />
                      <span>{suggestion.name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleAddIngredient(currentIngredient)}
          >
            Add
          </Button>
        </div>
      </form>

      <div className="flex flex-wrap gap-2 mb-4">
        {ingredients.map((ingredient, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-recipe-accent rounded-full flex items-center gap-2 animate-fade-in"
          >
            {ingredient}
            <button
              onClick={() => handleRemoveIngredient(index)}
              className="hover:text-red-500 transition-colors"
            >
              <X size={14} />
            </button>
          </span>
        ))}
      </div>

      {ingredients.length > 0 && (
        <Button
          onClick={handleSubmit}
          className="w-full bg-recipe-primary hover:bg-recipe-primary/90 text-white"
        >
          Find Recipes
        </Button>
      )}
    </div>
  );
};