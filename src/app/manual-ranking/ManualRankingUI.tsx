import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { CssBaseline } from '@mui/material';
import { baseLayout } from '../Layout';
import { BackgroundGrid, ResultsArea, SearchSelectorArea } from './RankingUILayout';
import { RankingSearchSelector } from './RankingSearchSelector';
import { recipeSearch } from '../../service/SearchService';
import { TitleSearchResult } from '../../service/schema';

export const ManualRankingUI:React.FC = () => {
  const [searchPhrase, setSearchPhrase] = useState("");
  const [maxScore, setMaxScore] = useState<number|undefined>(undefined);
  const [results, setResults] = useState<TitleSearchResult[]>([]);

  useEffect(() => {
    recipeSearch({
      queryText: searchPhrase,
    }).then(response=>{
      setMaxScore(response.maxScore ?? undefined);
      setResults(response.results);
    })
  }, [searchPhrase]);

  return <div css={baseLayout}>
    <Helmet>
      <meta name="viewport" content="initial-scale=1, width=device-width" />
      <title>Manual search ranking</title>
    </Helmet>
    <CssBaseline />

    <div css={BackgroundGrid}>
      <div css={SearchSelectorArea}>
        <RankingSearchSelector searchPhrase={searchPhrase} onChange={setSearchPhrase} maxScore={maxScore} resultCount={results.length}/>
      </div>

      <div css={ResultsArea}>

      </div>
    </div>
  </div>
}