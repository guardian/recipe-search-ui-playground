import { useEffect, useState } from 'react';
import { genericKeywordSearch } from '../service/SearchService';
import { CapiProfileTag, KeywordsGenericSlice } from '../service/schema';
import { Typography } from '@mui/material';
import { SuggestionComponent } from './SuggestionComponent';
import { ProfileCard } from './ProfileCard';
import { sideScrollingList } from './ListStyles';
import { ResultCard } from './ResultCard';
import { Celebration, DinnerDining, Flaky, RestaurantMenu } from '@mui/icons-material';

interface SuggestionsProps {
  forSearchTerm: string;
  updateForcer?: number;
  chefSelected: (chef:CapiProfileTag)=>void;
  cuisineSelected: (item:string)=>void;
  dietTypeSelected: (item:string)=>void;
  mealTypeSelected: (item:string)=>void;
  showChefs: boolean;
  errorCb: (err:string)=>void;
}

export const Suggestions = ({forSearchTerm, updateForcer, showChefs, chefSelected, cuisineSelected, dietTypeSelected, mealTypeSelected, errorCb}:SuggestionsProps) => {
  const [chefSuggestions, setChefSuggestions] = useState<KeywordsGenericSlice|undefined>();
  const [cuisineSuggestions, setCuisineSuggestions] = useState<KeywordsGenericSlice|undefined>();
  const [dietTypeSuggestions, setDietTypeSuggestions] = useState<KeywordsGenericSlice|undefined>();
  const [mealTypeSuggestions, setMealTypeSuggestions] = useState<KeywordsGenericSlice|undefined>();
  const [celebrationSuggestions, setCelebrationSuggestions] = useState<KeywordsGenericSlice|undefined>();

  useEffect(()=>{
    genericKeywordSearch(forSearchTerm)
      .then(results=>{
        setChefSuggestions(results.contributor_names);
        setCuisineSuggestions(results.cuisineIds);
        setDietTypeSuggestions(results.suitableForDietIds);
        setMealTypeSuggestions(results.mealTypeIds);
        setCelebrationSuggestions(results["celebrationIds.keyword"]);
      })
      .catch((err:Error)=>errorCb(err.toString()))
  }, [forSearchTerm, updateForcer]);

  const clickedSuggestion = ()=>{
  }

  const haveContent = ()=>
    (chefSuggestions && chefSuggestions.matches.length>0) ||
    (cuisineSuggestions && cuisineSuggestions.matches.length>0) ||
    (dietTypeSuggestions && dietTypeSuggestions.matches.length>0) ||
    (mealTypeSuggestions && mealTypeSuggestions.matches.length>0) ||
    (celebrationSuggestions && celebrationSuggestions.matches.length>0)

  return haveContent() ? <>
      {
        forSearchTerm.length > 0 ? <Typography>Maybe you meant...?</Typography> : <Typography>More search options</Typography>
      }
      <div style={{overflowY: "auto"}}>
      <ul css={sideScrollingList}>
        <>
          {showChefs && chefSuggestions && chefSuggestions.matches.length>0? <SuggestionComponent
            title="Chefs"
            {...chefSuggestions}
            renderContent={(profileId)=><ProfileCard profileId={profileId} onClick={chefSelected}/> }
          /> : undefined }
          {celebrationSuggestions && celebrationSuggestions.matches.length > 0 ? <SuggestionComponent
              title="Celebrations"
              {...celebrationSuggestions}
              renderContent={(type)=><ResultCard capitalize onClick={()=>{}} title={type} icon={<Celebration/>}/>}
            /> : undefined }

          {mealTypeSuggestions && mealTypeSuggestions.matches.length > 0 ? <SuggestionComponent
              title="Meals"
              {...mealTypeSuggestions}
              renderContent={(type)=><ResultCard capitalize onClick={()=>mealTypeSelected(type)} title={type} icon={<DinnerDining/>}/>}
          /> : undefined }
          {dietTypeSuggestions && dietTypeSuggestions.matches.length>0 ? <SuggestionComponent
              title="Dietry"
              {...dietTypeSuggestions}
              renderContent={(diet)=><ResultCard capitalize onClick={()=>dietTypeSelected(diet)} title={diet} icon={<Flaky/>}/>}
          /> : undefined }
          {cuisineSuggestions && cuisineSuggestions.matches.length>0 ? <SuggestionComponent
              title="Region"
              {...cuisineSuggestions}
              renderContent={(cuisine)=><ResultCard capitalize onClick={()=>cuisineSelected(cuisine)} title={cuisine} icon={<RestaurantMenu/>}/>}
          /> : undefined }
        </>
      </ul>
      </div>
   </> : undefined
}