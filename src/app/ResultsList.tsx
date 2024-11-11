import { TitleSearchResult } from '../service/schema';
import { sideScollingListItem, sideScrollingList } from './ListStyles';
import { RecipeCard } from './RecipeCard';
import { useEffect, useState } from 'react';
import { css, Typography } from '@mui/material';
import { ResultCard } from './ResultCard';
import { More, ReadMore } from '@mui/icons-material';

interface ResultsListProps {
  results: TitleSearchResult[];
  showScore?: boolean;
  scoreCutoff?: number;
}

const clickable = css`
    cursor: pointer;
    height: 100%;
`;

export const ResultsList = ({results, showScore, scoreCutoff}:ResultsListProps) => {
  const [showLessRelevant, setShowLessRelevant] = useState(false);
  const [haveLessRelevant, setHaveLessRelevant] = useState(false);

  const resultsToRender = scoreCutoff && !showLessRelevant ? results.filter((r)=>(r.score ?? 100)>scoreCutoff) : results;

  useEffect(() => {
    if(results.length>0) {
      const lastResult = results[results.length - 1];
      setHaveLessRelevant((lastResult.score ?? 100) <= (scoreCutoff ?? 0));
    } else {
      setHaveLessRelevant(false);
    }
    setShowLessRelevant(false);
  }, [results, scoreCutoff]);

  const showAll = ()=>setShowLessRelevant(true);

  return <ul css={sideScrollingList}>
    {
      resultsToRender.map(((hit, ctr)=><li css={sideScollingListItem} key={ctr}>
        <RecipeCard {...hit} showScore={showScore} onClick={()=>{ } }/>
      </li>))
    }
    {
      haveLessRelevant && !showLessRelevant ? <li css={sideScollingListItem}>
        <div css={clickable} onClick={showAll}>
          <ResultCard onClick={showAll} title="Show less relevant..." icon={<ReadMore/>}/>
        </div>
      </li>: undefined
    }
  </ul>
}