import { TitleSearchResult } from '../service/schema';
import { css, Grid, Paper, Typography } from '@mui/material';

interface ResultsListProps {
  results: TitleSearchResult[]
}

export const ResultsList = ({results}:ResultsListProps) => {
  const itemCss = css`
    list-style: none;
      margin: 2px;
  `;

  const listItemStyle = css`
    cursor: pointer;
      &:hover {
          background-color: cornflowerblue;
      }
  `;
  return <ul style={{paddingLeft: 0}}>
    {
      results.map(((hit, ctr)=><li css={itemCss} key={ctr}>
        <Paper elevation={1} css={listItemStyle}>
          <Typography>{hit.title}</Typography>
        </Paper>
      </li>))
    }
  </ul>
}