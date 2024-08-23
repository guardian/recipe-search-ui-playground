import { useEffect, useState } from 'react';
import { GetRecipeData } from '../service/RecipeService';
import { FullRecipe } from '../service/schema';
import { ResultCard, ResultCardProps } from './ResultCard';

interface RecipeCardProps extends ResultCardProps {
  href: string;
}

export const RecipeCard = ({href }:RecipeCardProps) => {
  const [error, setError] = useState<string|undefined>();
  const [recipe, setRecipe] = useState<FullRecipe|undefined>();

  useEffect(()=>{
    setError(undefined);

    GetRecipeData(href)
      .then(setRecipe)
      .catch((err:Error)=>setError(err.toString()))
  }, [href]);

  return recipe ? <ResultCard onClick={()=>{ }}
                              title={recipe?.title}
                              imageUrl={recipe.featuredImage.url}
                              error={error}
  /> : undefined;
}