import { css, Grid, Paper, Typography } from '@mui/material';
import { WarningRounded } from '@mui/icons-material';
import { resultCard } from './ListStyles';
import React from 'react';

export interface ResultCardProps {
  onClick: ()=>void;
  title: string;
  icon?: React.ReactNode;
  imageUrl?: string;
  error?: string;
  capitalize?: boolean;
}

function getThumbnailUrl(imageUrl:string):string {
  return imageUrl.replace(/width=(\d+)/, "width=120")
}

export const ResultCard = ( { title, onClick, icon, imageUrl, error, capitalize }:ResultCardProps) => {
  const imageHolder = css`
    width: 120px;
      height: 120px;
      border-radius: 8px;
  `;

  return <Paper elevation={1} css={resultCard} onClick={onClick}>
    <Grid container direction="column">
      <Grid item style={{marginLeft: "auto", marginRight: "auto"}}>
        {
          icon ? icon
            : <img src={imageUrl ? getThumbnailUrl(imageUrl) : ""} css={imageHolder}/>
        }
      </Grid>
      <Grid item>
        <Typography style={{ textTransform: capitalize ? "capitalize" : "initial" }}>{title}</Typography>
      </Grid>
      {error ? <Grid container>
        <Grid item><WarningRounded/></Grid>
        <Grid item><Typography>{error}</Typography></Grid>
      </Grid> : undefined}
    </Grid>
  </Paper>
}

