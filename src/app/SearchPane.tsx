import { css, Grid, Input, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { DebouncedInput } from './DebouncedInput';
import { useEffect, useState } from 'react';
import { Label } from '@mui/icons-material';
import { genericKeywordSearch } from '../service/SearchService';

export const SearchPane = () => {
  const searchPaneBase = css`
    display: flex;
      max-width: 40vw;
      max-height: 100vh;
      min-width: 40vw;
      min-height: 40vh;
      height: 90vh;
      margin: 5px;
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

  useEffect(()=>{
    genericKeywordSearch(searchString)
      .then((result)=>{
        console.log(result)
      })
      .catch((err:Error)=>setLastError(err.toString()));
  }, [searchString]);

  return <Paper css={searchPaneBase} elevation={3}>
      <Grid container css={inputStyling} spacing={1}>
        <Grid item><SearchIcon/></Grid>
        <Grid item css={growable}><DebouncedInput type="text" id="searchbox" css={inputStyling} timeout={500} onUpdated={(term)=>{
          console.log(term);
          setSearchString(term);
        }}/></Grid>
      </Grid>
    <Label>{searchString}</Label>
  </Paper>
}