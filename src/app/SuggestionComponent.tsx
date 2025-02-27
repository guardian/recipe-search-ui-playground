import { Paper } from '@mui/material';
import { sideScollingListItem } from './ListStyles';
import React from 'react';

interface SuggestionComponentProps {
  title: string;
  matches: string[]
  renderContent: (suggestion:string) => React.ReactNode;
}

export const SuggestionComponent = (props:SuggestionComponentProps) => {
  return props.matches.map((suggestion, ctr)=><li css={sideScollingListItem} key={ctr}>
          <Paper elevation={1}>
            {
              props.renderContent(suggestion)
            }
          </Paper>
        </li>)
      }
