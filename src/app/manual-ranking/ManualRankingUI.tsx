import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { CssBaseline } from '@mui/material';
import { baseLayout } from '../Layout';
import { BackgroundGrid, ResultsArea, SearchSelectorArea } from './RankingUILayout';
import { RankingSearchSelector } from './RankingSearchSelector';
import { recipeSearch } from '../../service/SearchService';
import { FullSearchDataResult } from '../../service/schema';
import { RankingResults } from './RankingResults';

export const ManualRankingUI:React.FC = () => {
  const [searchPhrase, setSearchPhrase] = useState("");
  const [maxScore, setMaxScore] = useState<number|undefined>(undefined);
  const [minScore, setMinScore] = useState<number|undefined>(undefined);
  const [results, setResults] = useState<FullSearchDataResult[]>([]);
  const [searchLimit, setSearchLimit] = useState(25);

  useEffect(() => {
    if(searchPhrase==="") {
      setMaxScore(undefined);
      setMinScore(undefined);
      setResults([]);
    } else {
      recipeSearch({
        queryText: searchPhrase,
        limit: searchLimit,
        format: "Full"
      }).then(response => {
        setMaxScore(response.maxScore ?? undefined);
        setResults(response.results as FullSearchDataResult[]);
      })
    }
  }, [searchPhrase, searchLimit]);

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
        <RankingSearchSelector searchPhrase={searchPhrase} onChange={setSearchPhrase}
                               maxScore={maxScore} resultCount={results.length}
                               limit={searchLimit} onLimitChange={setSearchLimit}
        />
      </div>

      <div css={ResultsArea}>
        <RankingResults results={results}/>
      </div>
    </div>
  </div>
}