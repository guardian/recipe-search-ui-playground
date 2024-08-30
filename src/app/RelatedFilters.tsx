import { sideScrollingList } from './ListStyles';
import { SuggestionComponent } from './SuggestionComponent';
import { ProfileCard } from './ProfileCard';
import { ResultCard } from './ResultCard';
import { DinnerDining, Flaky, RestaurantMenu } from '@mui/icons-material';
import { StatsEntry } from '../service/schema';
import { Typography } from '@mui/material';

interface RelatedFiltersProps {
  diets?: StatsEntry;
  dietTypeSelected: (dt:string)=>void;
}

export const RelatedFilters:React.FC<RelatedFiltersProps> = ({diets, dietTypeSelected }) => {
  return <div style={{ overflowY: "auto" }}>
    <Typography>Too many to choose from? Why not narrow down your search</Typography>
    <ul css={sideScrollingList}>
      <>
        {/*{showChefs && chefSuggestions && chefSuggestions.matches.length > 0 ? <SuggestionComponent*/}
        {/*  title="Chefs"*/}
        {/*  {...chefSuggestions}*/}
        {/*  renderContent={(profileId) => <ProfileCard profileId={profileId} onClick={chefSelected} />}*/}
        {/*/> : undefined}*/}
        {/*{mealTypeSuggestions && mealTypeSuggestions.matches.length > 0 ? <SuggestionComponent*/}
        {/*  title="Meals"*/}
        {/*  {...mealTypeSuggestions}*/}
        {/*  renderContent={(type) => <ResultCard capitalize onClick={() => mealTypeSelected(type)} title={type}*/}
        {/*                                       icon={<DinnerDining />} />}*/}
        {/*/> : undefined}*/}
        {diets && diets.buckets.length > 0 ? <SuggestionComponent
          title="Dietry"
          matches={diets.buckets.map((_)=>_.key)}
          renderContent={(diet) => <ResultCard capitalize onClick={() => dietTypeSelected(diet)} title={diet}
                                               icon={<Flaky />} />}
        /> : undefined}
        {/*{cuisineSuggestions && cuisineSuggestions.matches.length > 0 ? <SuggestionComponent*/}
        {/*  title="Region"*/}
        {/*  {...cuisineSuggestions}*/}
        {/*  renderContent={(cuisine) => <ResultCard capitalize onClick={() => cuisineSelected(cuisine)} title={cuisine}*/}
        {/*                                          icon={<RestaurantMenu />} />}*/}
        {/*/> : undefined}*/}
      </>
    </ul>
  </div>
}