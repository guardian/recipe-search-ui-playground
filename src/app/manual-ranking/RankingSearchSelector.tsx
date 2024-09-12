import React, { useEffect, useState } from 'react';
import { Checkbox, css, FormControlLabel, Grid, Input, InputLabel, Paper, Typography } from '@mui/material';
import { DebouncedInput } from '../DebouncedInput';
import { FullPaper } from './RankingUILayout';

import SearchIcon from '@mui/icons-material/Search';
import { RecipeSearchParams } from '../../service/SearchService';

interface RankingSearchSelectorProps {
  searchRequested: (params:RecipeSearchParams)=>void;
  resultCount?: number;
  maxScore?: number;
  minScore?: number;
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
export const RankingSearchSelector:React.FC<RankingSearchSelectorProps> = ({searchRequested,
                                                                             maxScore,
                                                                             resultCount,
                                                                             minScore
                                                                           }) => {
  const [searchPhrase, setSearchPhrase] = useState("");
  const [limit, setLimit] = useState(25);
  const [fieldTitle, setFieldTitle] = useState(true);
  const [fieldDesc, setFieldDesc] = useState(true);
  const [fieldIng, setFieldIng] = useState(true);

  const ingredientsList = ()=>{
    const l:string[] = [];
    if(fieldTitle) l.push("title_vec");
    if(fieldDesc) l.push("description_vec");
    if(fieldIng) l.push("ingredients_mean_vec");
    return l.length>0 ? l : undefined;
  }

  useEffect(() => {
    searchRequested({
      queryText: searchPhrase,
      limit,
      format: "Full",
      fields: ingredientsList()
    });
  }, [searchPhrase, limit, fieldTitle, fieldDesc, fieldIng]);

  return <Paper css={FullPaper} style={{padding:"1em"}}>
    <Grid container css={inputStyling} spacing={1}>
      <Grid item><SearchIcon style={{marginTop: "1em"}}/></Grid>
      <Grid item css={growable}>
        <InputLabel htmlFor="searchbox">Search</InputLabel>
        <DebouncedInput placeholder="Find me a recipe, or a chef, or a meal type, or a suggestion..." type="text" id="searchbox"
                        css={inputStyling}
                        timeout={500}
                        initialValue={searchPhrase}
                        onUpdated={setSearchPhrase}
        /></Grid>
      <Grid item css={constrainedElement}>
        <InputLabel htmlFor="search-limit">Limit</InputLabel>
        <Input id="search-limit" type="number" aria-label="Search limit" value={limit} onChange={(evt)=>setLimit(parseInt(evt.target.value))}/>
      </Grid>
    </Grid>
    <Grid container spacing={2}>
      <Grid item>
        <FormControlLabel control={<Checkbox checked={fieldTitle} onChange={(evt)=>setFieldTitle(evt.target.checked)}/>}
                          label="Search title"
        />
      </Grid>
      <Grid item>
        <FormControlLabel control={<Checkbox checked={fieldDesc} onChange={(evt)=>setFieldDesc(evt.target.checked)}/>}
                          label="Search description"
        />
      </Grid>
      <Grid item>
        <FormControlLabel control={<Checkbox checked={fieldIng} onChange={(evt)=>setFieldIng(evt.target.checked)}/>}
                          label="Search ingredients"
        />
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
          maxScore && minScore ? <Typography>Maximum result score from the engine was {Math.round(maxScore*100)}% and the minimum was {Math.round(minScore*100)}%</Typography> : undefined
        }
      </Grid>
    </Grid>
  </Paper>
}