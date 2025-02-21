import { KeywordsGenericSearchResponse, RecipeSearchResponse } from './schema';

export const baseUrl = "https://recipes.guardianapis.com";

export async function genericKeywordSearch(term:string):Promise<KeywordsGenericSearchResponse> {
  const endpoint = baseUrl + `/keywords/detection?q=${encodeURIComponent(term)}`
  const response = await fetch(endpoint);
  if(response.status!==200) {
    throw new Error(`Could not search: server returned ${response.status}`);
  } else {
    const rawData = await response.json();
    return KeywordsGenericSearchResponse.parse(rawData);
  }
}

interface FieldWithWeighting {
  name: string;
  weighting: number;  //should be 0<weighting<1
}

export interface RecipeSearchFilters {
  diets?: string[]; //must be a valid diet. use keyword search to find valid values
  contributors?: string[];  //must be a valid contributor. use keyword search to find valid values
  mealTypes?: string[];
  cuisines?: string[];
  filterType?: "Post"|"During";
}

export type SearchTypes = "Embedded"|"WeightedHybridSum"|"Match"|"Lucene";

interface RecipeSearchParams {
  queryText: string;
  searchType?: SearchTypes;
  fields?: (string|FieldWithWeighting)[];
  filters?: RecipeSearchFilters;
  enableCutOff?: boolean;
  limit?: number
}

export async function recipeSearch(params:RecipeSearchParams):Promise<RecipeSearchResponse> {
  const endpoint = baseUrl + "/search";

  const response = await fetch(endpoint, {
    method: "POST",
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if(response.status!==200) {
    throw new Error(`Could not search: server returned ${response.status}`);
  } else {
    const rawData = await response.json();
    return RecipeSearchResponse.parse(rawData);
  }
}