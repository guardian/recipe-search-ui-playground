import { Helmet } from 'react-helmet';
import { css, CssBaseline } from '@mui/material';
import { SearchPane } from './SearchPane';

export const MainSearchComponent = () => {
  const baseLayout = css`
    width: 100vw;
      height: 100vh;
  `;

  return <div css={baseLayout}>
    <Helmet>
      <meta name="viewport" content="initial-scale=1, width=device-width" />
      <title>Recipe search test</title>
    </Helmet>
    <CssBaseline/>

    <SearchPane/>
  </div>
}