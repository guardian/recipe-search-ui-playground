import { TitleSearchResult } from '../service/schema';
import { sideScollingListItem, sideScrollingList } from './ListStyles';
import { RecipeCard } from './RecipeCard';

interface ResultsListProps {
  results: TitleSearchResult[];
  showScore?: boolean;
  scoreCutoff?: number;
}

export const ResultsList = ({results, showScore, scoreCutoff}:ResultsListProps) => {
  const resultsToRender = scoreCutoff ? results.filter((r)=>r.score>scoreCutoff) : results;

  return <ul css={sideScrollingList}>
    {
      resultsToRender.map(((hit, ctr)=><li css={sideScollingListItem} key={ctr}>
        <RecipeCard {...hit} showScore={showScore} onClick={()=>{ } }/>
      </li>))
    }
  </ul>
}