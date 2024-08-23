import { FullRecipe, TitleSearchResult } from '../service/schema';
import { css, Grid, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { GetRecipeData } from '../service/RecipeService';
import { WarningRounded } from '@mui/icons-material';

interface ResultCardProps extends TitleSearchResult {
  onClick: ()=>void;
}

function getThumbnailUrl(imageUrl:string):string {
  return imageUrl.replace(/width=(\d+)/, "width=120")
}

export const ResultCard = ( { title, onClick, href }:ResultCardProps) => {
  const [recipe, setRecipe] = useState<FullRecipe|undefined>();
  const [error, setError] = useState<string|undefined>();
  const [thumbnailUrl, setThumbnailUrl] = useState<string|undefined>();

  const listItemStyle = css`
    cursor: pointer;
      &:hover {
          background-color: cornflowerblue;
      }
      width: 140px;
      padding: 4px;
  `;

  const imageHolder = css`
    width: 120px;
      height: 120px;
      border-radius: 8px;
  `;

  useEffect(()=>{
    setError(undefined);

    GetRecipeData(href)
      .then((recep)=>{
        setThumbnailUrl(getThumbnailUrl(recep.featuredImage.url))
        setRecipe(recep)
      })
      .catch((err:Error)=>setError(err.toString()))
  }, [href]);

  return <Paper elevation={1} css={listItemStyle} onClick={onClick}>
    <Grid container direction="column">
      <Grid item style={{marginLeft: "auto", marginRight: "auto"}}>
        <img src={thumbnailUrl} css={imageHolder}/>
      </Grid>
      <Grid item>
        <Typography>{title}</Typography>
      </Grid>
      {error ? <Grid container>
        <Grid item><WarningRounded/></Grid>
        <Grid item><Typography>{error}</Typography></Grid>
      </Grid> : undefined}
    </Grid>
  </Paper>
}

