import React from "react";
import { css, Grid, Paper, Typography } from '@mui/material';
import { DebouncedInput } from '../DebouncedInput';
import { FullPaper } from './RankingUILayout';
import SearchIcon from '@mui/icons-material/Search';

interface RankingSearchSelectorProps {
  searchPhrase: string;
  onChange: (newValue:string)=>void;
  resultCount?: number;
  maxScore?: number;
}


const inputStyling = css`
    height: fit-content;
      width:100%;
  `;

const growable = css`
    flex-grow: 1;
  `;


export const RankingSearchSelector:React.FC<RankingSearchSelectorProps> = ({searchPhrase, onChange, maxScore, resultCount}) => {
  return <Paper css={FullPaper} style={{padding:"1em"}}>
    <Grid container css={inputStyling} spacing={1}>
      <Grid item><SearchIcon/></Grid>
      <Grid item css={growable}>
        <DebouncedInput placeholder="Find me a recipe, or a chef, or a meal type, or a suggestion..." type="text" id="searchbox"
                        css={inputStyling}
                        timeout={500}
                        initialValue={searchPhrase}
                        onUpdated={onChange}
        /></Grid>
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