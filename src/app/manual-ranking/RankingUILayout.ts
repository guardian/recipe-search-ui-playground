import { css } from "@mui/material";

export const FullPaper = css`
    height: 100%;
    width: 100%;
`;

export const BackgroundGrid = css`
    display: grid;
    grid-template-columns: repeat(10, 10fr);
    grid-template-rows: repeat(10, 10fr);
    width: 100%;
    height: 100%;
`;

export const SearchSelectorArea = css`
    grid-column-start: 1;
    grid-column-end: -1;
    grid-row-start: 1;
    grid-row-end: 3;
    padding: 1em;
    overflow: hidden;
`;

export const ResultsArea = css`
  grid-column-start: 1;
    grid-column-end: -1;
    grid-row-start: 3;
    grid-row-end: -1;
    padding: 1em;
    overflow: hidden;
`;