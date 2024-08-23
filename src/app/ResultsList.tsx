import { TitleSearchResult } from '../service/schema';
import { ResultCard } from './ResultCard';
import { sideScollingListItem, sideScrollingList } from './ListStyles';
import { RecipeCard } from './RecipeCard';

interface ResultsListProps {
  results: TitleSearchResult[]
}

export const ResultsList = ({results}:ResultsListProps) => {
  return <ul css={sideScrollingList}>
    {
      results.map(((hit, ctr)=><li css={sideScollingListItem} key={ctr}>
        <RecipeCard {...hit} onClick={()=>{ } }/>
      </li>))
    }
  </ul>
}