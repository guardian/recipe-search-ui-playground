import { Chip, css, Grid, Input, Typography } from '@mui/material';
import { MuiChipsInput } from 'mui-chips-input';
import React from "react";
import { CapiProfileTag } from '../service/schema';

interface FullSearchFormProps {
  onUpdated: (newChefs?:string[])=>void;
  chefs: CapiProfileTag[];
  onChefRemoved: (id:string)=>void;
}

export const FullSearchForm:React.FC<FullSearchFormProps> = ({onUpdated, chefs, onChefRemoved})=> {
  const heading = css`
    font-weight: bold;
  `;

  return <Grid container direction="column">
    <Grid item>
      <Grid container direction="row" spacing={2}>
        <Grid item>
          <Typography css={heading}>By</Typography>
        </Grid>
        <Grid item>
          <Grid container spacing={1} direction="row">
            {
              chefs.map((c, i)=><Grid item><Chip key={i}
                                                 label={c.webTitle}
                                                 onDelete={()=>onChefRemoved(c.id)}
              /></Grid>)
            }
          </Grid>
        </Grid>
    </Grid>
  </Grid>
  </Grid>
}