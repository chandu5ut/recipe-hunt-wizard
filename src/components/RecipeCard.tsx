import React from "react";
import { Check, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Recipe {
  id: number;
  title: string;
  image: string;
  usedIngredients: { original: string }[];
  missedIngredients: { original: string }[];
}

interface RecipeCardProps {
  recipe: Recipe;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow animate-fade-in">
      <div className="relative h-48 overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-lg text-recipe-text">{recipe.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <CardDescription className="font-medium mb-2 flex items-center gap-2">
              <Check className="text-green-500" size={16} />
              Ingredients You Have:
            </CardDescription>
            <ul className="text-sm space-y-1">
              {recipe.usedIngredients.map((ingredient, index) => (
                <li key={index}>{ingredient.original}</li>
              ))}
            </ul>
          </div>
          <div>
            <CardDescription className="font-medium mb-2 flex items-center gap-2">
              <X className="text-red-500" size={16} />
              Missing Ingredients:
            </CardDescription>
            <ul className="text-sm space-y-1">
              {recipe.missedIngredients.map((ingredient, index) => (
                <li key={index}>{ingredient.original}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};