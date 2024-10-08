import { Chip, css, Grid, Input, Typography } from '@mui/material';
import React from "react";
import { CapiProfileTag } from '../service/schema';

const headingStyle = css`
    font-weight: bold;
  `;

interface FullSearchFormProps {
  chefs: CapiProfileTag[];
  mealTypes: string[];
  diets: string[];
  cuisines: string[];
  onChefRemoved: (id:string)=>void;
  onMealTypeRemoved: (id:string)=>void;
  onDietRemoved: (id:string)=>void;
  onCuisineRemoved: (id:string)=>void;
}

interface FilterElementProps<T> {
  renderChip: (content:T, index:number)=>React.ReactElement;
  heading: string;
  content: T[];
}

function FilterElement<T>({renderChip, heading, content}:FilterElementProps<T>) {
  return  <Grid container direction="row" spacing={2}>
    <Grid item>
      <Typography css={headingStyle} style={{paddingTop: "0.2em", paddingRight: "0.2em"}}>{heading}</Typography>
    </Grid>
    <Grid item>
      <Grid container spacing={1} direction="row">
        {
          content.map((c, i)=><Grid item>{renderChip(c, i)}</Grid>)
        }
      </Grid>
    </Grid>
  </Grid>
}

export const FullSearchForm:React.FC<FullSearchFormProps> = ({chefs, mealTypes, diets, cuisines, onChefRemoved, onMealTypeRemoved, onDietRemoved, onCuisineRemoved})=> {


  return <Grid container direction="row" spacing={3}>
    { chefs.length > 0 ? <Grid item>
      <FilterElement heading="By" content={chefs}
                     renderChip={(c:CapiProfileTag,i)=>
                        <Chip key={i} label={c.webTitle} onDelete={()=>onChefRemoved(c.id)} />
                    }
      />
    </Grid> : undefined }

    { mealTypes.length > 0 ? <Grid item>
      <FilterElement heading="For" content={mealTypes}
                     renderChip={(mt, i)=>
                       <Chip key={i} label={mt} onDelete={()=>onMealTypeRemoved(mt)}/>}
      />
    </Grid> : undefined }

    {diets.length + cuisines.length > 0 ? <Grid item>
        <FilterElement heading="That is" content={diets.concat(cuisines)}
                       renderChip={(dt, i)=>
                        <Chip key={i} label={dt} onDelete={()=>{
                          onDietRemoved(dt);
                          onCuisineRemoved(dt);
                        }}/>}
        />
    </Grid> : undefined }
  </Grid>
}