import { KeywordsGenericSlice } from '../service/schema';
import { Paper, Typography } from '@mui/material';
import { sideScollingListItem, sideScrollingList } from './ListStyles';
import React from 'react';

interface SuggestionComponentProps extends KeywordsGenericSlice {
  title: string;
  renderContent: (suggestion:string) => React.ReactNode;
}

export const SuggestionComponent = (props:SuggestionComponentProps) => {
  return <div>
    <Typography style={{fontWeight: "bold"}}>{props.title}</Typography>

    <ul css={sideScrollingList}>
      {
        props.matches.map(suggestion=><li css={sideScollingListItem}>
          <Paper elevation={1}>
            {
              props.renderContent(suggestion)
            }
          </Paper>
        </li>)
      }
    </ul>
  </div>
}