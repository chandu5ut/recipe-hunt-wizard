import { toast } from "@/components/ui/use-toast";

const RECIPE_SYSTEM_PROMPT = `You are a professional chef and recipe expert. Analyze the given ingredients and suggest detailed recipes. For each recipe, provide:
1. Title
2. List of provided ingredients that will be used
3. List of additional ingredients needed
4. A URL to a relevant recipe image (use realistic cooking blog URLs)
Format the response as a JSON array of recipe objects.`;

export const generateRecipesSuggestions = async (ingredients: string[]) => {
  const apiKey = localStorage.getItem("OPENAI_API_KEY");
  
  if (!apiKey) {
    toast({
      title: "API Key Required",
      description: "Please enter your OpenAI API key first.",
      variant: "destructive",
    });
    return [];
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: RECIPE_SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: `I have these ingredients: ${ingredients.join(", ")}. Suggest 3 possible recipes.`,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 401) {
        localStorage.removeItem("OPENAI_API_KEY"); // Clear invalid API key
        toast({
          title: "Invalid API Key",
          description: "Please check your OpenAI API key and try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: errorData.error?.message || "Failed to generate recipes",
          variant: "destructive",
        });
      }
      return [];
    }

    const data = await response.json();
    const recipes = JSON.parse(data.choices[0].message.content);
    return recipes.map((recipe: any, index: number) => ({
      id: index + 1,
      ...recipe,
    }));
  } catch (error) {
    console.error("Error generating recipes:", error);
    toast({
      title: "Error",
      description: "Failed to generate recipe suggestions. Please try again.",
      variant: "destructive",
    });
    return [];
  }
};