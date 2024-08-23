import { KeywordsGenericSearchResponse } from './schema';

const baseUrl = "https://recipes.guardianapis.com";

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