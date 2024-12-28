import React, { useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface IngredientInputProps {
  onSubmit: (ingredients: string[]) => void;
}

export const IngredientInput: React.FC<IngredientInputProps> = ({ onSubmit }) => {
  const [currentIngredient, setCurrentIngredient] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);

  const handleAddIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentIngredient.trim()) {
      setIngredients([...ingredients, currentIngredient.trim()]);
      setCurrentIngredient("");
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
      <form onSubmit={handleAddIngredient} className="mb-4">
        <div className="flex gap-2">
          <Input
            type="text"
            value={currentIngredient}
            onChange={(e) => setCurrentIngredient(e.target.value)}
            placeholder="Enter an ingredient..."
            className="flex-1"
          />
          <Button type="submit" variant="outline">
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