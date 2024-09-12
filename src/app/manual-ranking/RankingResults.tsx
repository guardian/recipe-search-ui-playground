import React from "react";
import { FullSearchDataResult } from '../../service/schema';
import { Chip, css, Grid, Paper, Typography } from '@mui/material';

interface RankingResultsProps {
  results: FullSearchDataResult[];
}

const silentList = css`
    list-style: none;
`;

const recipeTitle = css`
    font-weight: bold;
`;
const recipeScore = css`
  font-size: 1.4em;
    vertical-align: middle;
`;

const recipeByline = css`
    font-size: 0.8em;
    font-style: italic;
`;
const recipeDescription = css`
    font-style: italic;
`;

const paperStyle = css`
    height:100%;
    overflow-x: hidden;
    overflow-y: scroll;
`;

const recipeGridBase = css`
    max-width: 24%;
`;
const recipeGridFixed = css`
    min-width: 24%;
    max-width: 24%;
`;
const chipHolder = css`
    padding-top: 0.4em;
    padding-bottom: 0.4em;
`;
const chipSpacing = css`
    margin: 0.1em;
`;

export const RankingResults:React.FC<RankingResultsProps> = ({results}) => {
  return <Paper css={paperStyle}>
    <ul css={silentList}>
      {
        results.map((entry, ctr)=><li key={ctr}>
          <Grid container spacing={4}>
            <Grid item css={recipeGridBase}>
              <Typography css={recipeScore}>{entry.score ? Math.round(entry.score*100).toString() : "--"}%</Typography>
            </Grid>
            <Grid item css={recipeGridFixed}>
              <Typography css={recipeTitle}>{entry.title}</Typography>
              <Typography css={recipeByline}>{entry.contributor_names.join(",")} {entry.byline.join(",")}</Typography>
              <Grid container css={chipHolder} spacing={1}>
                {
                  entry.mealTypeIds?.map((mt, c)=><Chip css={chipSpacing} key={c} label={mt}/>)
                }
              </Grid>
              <Grid container css={chipHolder} spacing={1}>
                {
                  entry.cuisineIds?.map((mt, c)=><Chip css={chipSpacing} key={c} label={mt}/>)
                }
              </Grid>
              <Grid container css={chipHolder} spacing={1}>
                {
                  entry.suitableForDietIds?.map((mt, c)=><Chip css={chipSpacing} key={c} label={mt}/>)
                }
              </Grid>
            </Grid>
            <Grid item css={recipeGridBase}>
              <Typography css={recipeDescription}>{entry.description}</Typography>
            </Grid>
          </Grid>
          <hr/>
        </li>)
      }
    </ul>
  </Paper>
}