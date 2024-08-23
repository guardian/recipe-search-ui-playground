import { KeywordsGenericSlice } from '../service/schema';
import { Paper, Typography } from '@mui/material';
import { sideScollingListItem, sideScrollingList } from './ListStyles';

interface SuggestionComponentProps extends KeywordsGenericSlice {
  title: string;
}
export const SuggestionComponent = (props:SuggestionComponentProps) => {
  return <div>
    <Typography style={{fontWeight: "bold"}}>{props.title}</Typography>

    <ul css={sideScrollingList}>
      {
        props.matches.map(suggestion=><li css={sideScollingListItem}>
          <Paper elevation={1}>
            <Typography>{suggestion.toLowerCase()}</Typography>
          </Paper>
        </li>)
      }
    </ul>
  </div>
}