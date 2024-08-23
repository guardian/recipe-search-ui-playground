import { TitleSearchResult } from '../service/schema';
import { css, Grid, Paper, Typography } from '@mui/material';
import { ResultCard } from './ResultCard';

interface ResultsListProps {
  results: TitleSearchResult[]
}

export const ResultsList = ({results}:ResultsListProps) => {
  const itemCss = css`
    list-style: none;
      margin: 2px;
      display: inline-block;
  `;

  return <ul style={{paddingLeft: 0, width: "max-content"}}>
    {
      results.map(((hit, ctr)=><li css={itemCss} key={ctr}>
        <ResultCard {...hit} onClick={()=>{ } }/>
      </li>))
    }
  </ul>
}