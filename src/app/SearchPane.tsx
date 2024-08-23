import { css, Grid, Input, Paper, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { DebouncedInput } from './DebouncedInput';
import { useEffect, useState } from 'react';
import { Label } from '@mui/icons-material';
import { genericKeywordSearch, recipeSearch } from '../service/SearchService';
import { TitleSearchResult } from '../service/schema';
import { ResultsList } from './ResultsList';
import { Suggestions } from './Suggestions';

export const SearchPane = () => {
  const searchPaneBase = css`
    display: flex;
      max-width: 95vw;
      max-height: 100vh;
      min-width: 95vw;
      min-height: 40vh;
      height: 90vh;
      margin: auto;
      padding: 1em;
      flex: 1;
  `;

  const inputStyling = css`
    height: fit-content;
      width:100%;
  `;

  const growable = css`
    flex-grow: 1;
  `;

  const [searchString, setSearchString] = useState("");
  const [lastError, setLastError] = useState<string|undefined>();

  const [searchHits, setSearchHits] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [results, setResults] = useState<TitleSearchResult[]>([]);

  useEffect(()=>{
    recipeSearch({queryText: searchString})
      .then((result)=>{
        setSearchHits(result.hits);
        if(result.maxScore) setMaxScore(result.maxScore);
        setResults(result.results);
      })
      .catch((err:Error)=>setLastError(err.toString()));
  }, [searchString]);

  return <Paper css={searchPaneBase} elevation={3}>
    <Grid container direction="column" columns={1}>
        <Grid item>
        <Grid container css={inputStyling} spacing={1}>
          <Grid item><SearchIcon/></Grid>
          <Grid item css={growable}><DebouncedInput placeholder="Find me a recipe..." type="text" id="searchbox" css={inputStyling} timeout={500} onUpdated={(term)=>{
            console.log(term);
            setSearchString(term);
          }}/></Grid>
        </Grid>
      </Grid>

      <Grid item>
        <span>
          <Typography>We found {searchHits} recipes that might interest you...</Typography>
        </span>
      </Grid>

      <Grid item style={{width: "100%", maxHeight: "40%", marginTop: "0.4em", overflow: "auto"}}>
        <ResultsList results={results}/>
      </Grid>

      <Grid item style={{width: "100%", maxHeight: "40%", marginTop: "0.4em"}}>
        <Suggestions forSearchTerm={searchString}></Suggestions>
      </Grid>
    </Grid>
  </Paper>
}