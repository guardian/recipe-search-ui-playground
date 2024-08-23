import { FullRecipe } from './schema';
import { baseUrl } from './SearchService';

export async function GetRecipeData(path:string):Promise<FullRecipe> {
  const endpoint = baseUrl + path;
  const response = await fetch(endpoint);
  if(response.status===200) {
    const rawContent = await response.json();
    return FullRecipe.parse(rawContent);
  } else {
    throw new Error(`Server error ${response.status}`)
  }
}