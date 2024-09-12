import React from "react";
import { css, Grid, Input, InputLabel, Paper, Typography } from '@mui/material';
import { DebouncedInput } from '../DebouncedInput';
import { FullPaper } from './RankingUILayout';

import SearchIcon from '@mui/icons-material/Search';

interface RankingSearchSelectorProps {
  searchPhrase: string;
  onChange: (newValue:string)=>void;
  resultCount?: number;
  maxScore?: number;
  limit: number;
  onLimitChange: (newValue:number)=>void;
}

const inputStyling = css`
    height: fit-content;
      width:100%;
  `;

const growable = css`
    flex-grow: 1;
  `;

const constrainedElement = css`
    max-width: 100px;
`;
export const RankingSearchSelector:React.FC<RankingSearchSelectorProps> = ({searchPhrase,
                                                                             onChange,
                                                                             maxScore,
                                                                             resultCount,
                                                                            limit,
                                                                            onLimitChange
                                                                           }) => {
  return <Paper css={FullPaper} style={{padding:"1em"}}>
    <Grid container css={inputStyling} spacing={1}>
      <Grid item><SearchIcon style={{marginTop: "1em"}}/></Grid>
      <Grid item css={growable}>
        <InputLabel htmlFor="searchbox">Search</InputLabel>
        <DebouncedInput placeholder="Find me a recipe, or a chef, or a meal type, or a suggestion..." type="text" id="searchbox"
                        css={inputStyling}
                        timeout={500}
                        initialValue={searchPhrase}
                        onUpdated={onChange}
        /></Grid>
      <Grid item css={constrainedElement}>
        <InputLabel htmlFor="search-limit">Limit</InputLabel>
        <Input id="search-limit" type="number" aria-label="Search limit" value={limit} onChange={(evt)=>onLimitChange(parseInt(evt.target.value))}/>
      </Grid>
    </Grid>
    <Grid container direction="column" style={{marginTop: "1em"}}>
      <Grid item>
        {
          resultCount ? <Typography>Found {resultCount} recipes.</Typography> : undefined
        }
      </Grid>
      <Grid item>
        {
          maxScore ? <Typography>Maximum result score from the engine was {Math.round(maxScore*100)}%</Typography> : undefined
        }
      </Grid>
    </Grid>
  </Paper>
}