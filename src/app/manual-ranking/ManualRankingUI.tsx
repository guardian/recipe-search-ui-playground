import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { CssBaseline } from '@mui/material';
import { baseLayout } from '../Layout';
import { BackgroundGrid, ResultsArea, SearchSelectorArea } from './RankingUILayout';
import { RankingSearchSelector } from './RankingSearchSelector';
import { recipeSearch, RecipeSearchParams } from '../../service/SearchService';
import { FullSearchDataResult } from '../../service/schema';
import { RankingResults } from './RankingResults';

export const ManualRankingUI:React.FC = () => {
  const [maxScore, setMaxScore] = useState<number|undefined>(undefined);
  const [minScore, setMinScore] = useState<number|undefined>(undefined);
  const [results, setResults] = useState<FullSearchDataResult[]>([]);
  const [searchInProgress, setSearchInProgress] = useState(false);

  const runSearch = (params:RecipeSearchParams) => {
    if(params.queryText==="") {
      setMaxScore(undefined);
      setMinScore(undefined);
      setResults([]);
    } else {
      setSearchInProgress(true);

      recipeSearch(params)
        .then(response => {
          setMaxScore(response.maxScore ?? undefined);
          setResults(response.results as FullSearchDataResult[]);
          setSearchInProgress(false);
        })
        .catch(err=>{
          console.error(err);
          setSearchInProgress(false);
        })
    }
  };

  useEffect(() => {
    if(results.length===0) {
      setMinScore(undefined);
    } else {
      const lastResult = results[results.length-1];
      setMinScore(lastResult.score ?? undefined);
    }
  }, [results]);
  return <div css={baseLayout}>
    <Helmet>
      <meta name="viewport" content="initial-scale=1, width=device-width" />
      <title>Manual search ranking</title>
    </Helmet>
    <CssBaseline />

    <div css={BackgroundGrid}>
      <div css={SearchSelectorArea}>
        <RankingSearchSelector searchRequested={runSearch}
                               maxScore={maxScore}
                               minScore={minScore}
                               resultCount={results.length}
        />
      </div>

      <div css={ResultsArea}>
        {
          searchInProgress ? undefined : <RankingResults results={results}/>
        }
      </div>
    </div>
  </div>
}