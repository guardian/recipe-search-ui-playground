import { useEffect, useState } from 'react';
import { genericKeywordSearch } from '../service/SearchService';
import { KeywordsGenericSlice } from '../service/schema';
import { Typography } from '@mui/material';
import { SuggestionComponent } from './SuggestionComponent';
import { ProfileCard } from './ProfileCard';

interface SuggestionsProps {
  forSearchTerm: string;
}

export const Suggestions = ({forSearchTerm}:SuggestionsProps) => {
  const [lastError, setLastError] = useState("");
  const [chefSuggestions, setChefSuggestions] = useState<KeywordsGenericSlice|undefined>();
  const [cuisineSuggestions, setCuisineSuggestions] = useState<KeywordsGenericSlice|undefined>();
  const [dietTypeSuggestions, setDietTypeSuggestions] = useState<KeywordsGenericSlice|undefined>();
  const [mealTypeSuggestions, setMealTypeSuggestions] = useState<KeywordsGenericSlice|undefined>();

  useEffect(()=>{
    genericKeywordSearch(forSearchTerm)
      .then(results=>{
        setChefSuggestions(results.contributor_names);
        setCuisineSuggestions(results.cuisineIds);
        setDietTypeSuggestions(results.suitableForDietIds);
        setMealTypeSuggestions(results.mealTypeIds);
      })
      .catch((err:Error)=>setLastError(err.toString()))
  }, [forSearchTerm]);

  if(! (chefSuggestions || cuisineSuggestions || dietTypeSuggestions || mealTypeSuggestions)) {
    return undefined
  } else {
    return <>
      <Typography>Maybe you meant...?</Typography>
      {chefSuggestions && chefSuggestions.matches.length>0? <SuggestionComponent
        title="Chefs"
        {...chefSuggestions}
        renderContent={(profileId)=><ProfileCard profileId={profileId} onClick={()=>{ }}/> }
      /> : undefined }
    </>
  }
}