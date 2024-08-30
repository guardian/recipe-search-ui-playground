import { sideScrollingList } from './ListStyles';
import { SuggestionComponent } from './SuggestionComponent';
import { ProfileCard } from './ProfileCard';
import { ResultCard } from './ResultCard';
import { DinnerDining, Flaky, RestaurantMenu } from '@mui/icons-material';
import { CapiProfileTag, StatsEntry } from '../service/schema';
import { Typography } from '@mui/material';

interface RelatedFiltersProps {
  diets?: StatsEntry;
  chefs?: StatsEntry;
  dietTypeSelected: (dt:string)=>void;
  chefSelected?: (name:CapiProfileTag|undefined)=>void;
}

export const RelatedFilters:React.FC<RelatedFiltersProps> = ({diets, chefs, dietTypeSelected, chefSelected }) => {
  return <>
    <Typography>Would you like to narrow your search further?</Typography>
    <div style={{ overflowY: 'auto' }}>
      <ul css={sideScrollingList}>
        {chefs && chefs.buckets.length > 0 ? <SuggestionComponent
          title="Chefs"
          matches={chefs.buckets.map((_) => _.key)}
          renderContent={(profileId) => <ProfileCard profileId={profileId} onClick={chefSelected} />}
        /> : undefined}
      </ul>
    </div>
    <div style={{ overflowY: "auto" }}>
      <ul css={sideScrollingList}>
        <>
          {/*{mealTypeSuggestions && mealTypeSuggestions.matches.length > 0 ? <SuggestionComponent*/}
          {/*  title="Meals"*/}
          {/*  {...mealTypeSuggestions}*/}
          {/*  renderContent={(type) => <ResultCard capitalize onClick={() => mealTypeSelected(type)} title={type}*/}
          {/*                                       icon={<DinnerDining />} />}*/}
          {/*/> : undefined}*/}
          {diets && diets.buckets.length > 0 ? <SuggestionComponent
            title="Dietry"
            matches={diets.buckets.map((_) => _.key)}
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
  </>
}