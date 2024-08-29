import { useEffect, useState } from 'react';
import { GetRecipeData } from '../service/RecipeService';
import { FullRecipe } from '../service/schema';
import { ResultCard, ResultCardProps } from './ResultCard';

interface RecipeCardProps extends ResultCardProps {
  href: string;
  score?: number;
  showScore?: boolean;
  onClick: ()=>void;
}

export const RecipeCard = ({href, score, showScore, onClick }:RecipeCardProps) => {
  const [error, setError] = useState<string|undefined>();
  const [recipe, setRecipe] = useState<FullRecipe|undefined>();

  useEffect(()=>{
    setError(undefined);

    GetRecipeData(href)
      .then(setRecipe)
      .catch((err:Error)=>setError(err.toString()))
  }, [href]);

  const title = (score && showScore && score < 1) ?  recipe?.title + " (" + Math.ceil(score*100).toString() +"%)" : recipe?.title;

  return recipe ? <ResultCard onClick={onClick}
                              title={title ?? "(no title)"}
                              imageUrl={recipe.featuredImage.url}
                              error={error}
  /> : undefined;
}