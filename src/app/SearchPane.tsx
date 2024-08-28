import { Accordion, AccordionDetails, AccordionSummary, css, Grid, Input, Paper, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { DebouncedInput } from './DebouncedInput';
import { useEffect, useState } from 'react';
import { ExpandMore, Label } from '@mui/icons-material';
import { genericKeywordSearch, recipeSearch, RecipeSearchFilters } from '../service/SearchService';
import { CapiProfileTag, TitleSearchResult } from '../service/schema';
import { ResultsList } from './ResultsList';
import { Suggestions } from './Suggestions';
import { FullSearchForm } from './FullSearchForm';

const visualRelevancyCutoff = 0.72;

export const SearchPane = () => {
  const searchPaneBase = css`
    display: flex;
      max-width: 95vw;
      max-height: 100vh;
      min-width: 95vw;
      min-height: 40vh;
      height: 90vh;
      margin: auto;
      padding: 1em;
      flex: 1;
  `;

  const inputStyling = css`
    height: fit-content;
      width:100%;
  `;

  const growable = css`
    flex-grow: 1;
  `;

  const [searchString, setSearchString] = useState("");
  const [lastError, setLastError] = useState<string|undefined>();

  const [searchExpanded, setSearchExpanded] = useState(false);

  const [searchHits, setSearchHits] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [results, setResults] = useState<TitleSearchResult[]>([]);

  const [selectedChefs, setSelectedChefs] = useState<CapiProfileTag[]>([]);

  const [suggestionUpdateForcer, setSuggestionUpdateForcer] = useState(0);
  const forceSuggestionUpdate = ()=>setSuggestionUpdateForcer(prev=>prev+1);

  const getFilters:()=>RecipeSearchFilters|undefined = ()=>selectedChefs.length > 0 ? ({
    filterType: "Post",
    contributors: selectedChefs.map(c=>c.id)
  }) : undefined;

  useEffect(()=>{
    recipeSearch({
      queryText: searchString,
      filters: getFilters(),
    })
      .then((result)=>{
        setSearchHits(result.hits);
        if(result.maxScore) setMaxScore(result.maxScore);
        setResults(result.results);
        forceSuggestionUpdate();
      })
      .catch((err:Error)=>setLastError(err.toString()));
  }, [searchString, selectedChefs]);

  useEffect(()=>{
    const shouldExpand = selectedChefs.length > 0;  //TODO - add more in here as they are implemented
    setSearchExpanded(shouldExpand);
  }, [selectedChefs])
  return <Paper css={searchPaneBase} elevation={3}>
    <Grid container direction="column" columns={1}>

      <Grid item>
        <Accordion expanded={searchExpanded}>
          <AccordionSummary
            expandIcon={<ExpandMore onClick={()=>setSearchExpanded(prev=>!prev)}/>}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Grid container css={inputStyling} spacing={1}>
              <Grid item><SearchIcon/></Grid>
              <Grid item css={growable}>
                <DebouncedInput placeholder="Find me a recipe..." type="text" id="searchbox"
                                css={inputStyling}
                                timeout={500}
                                initialValue={searchString}
                                onUpdated={(term)=>{
                                  setSearchString(term);
                                }}
                /></Grid>
            </Grid>
          </AccordionSummary>
          <AccordionDetails>
            <FullSearchForm
              chefs={selectedChefs}
              onChefRemoved={(chefId)=>setSelectedChefs((prev)=>prev.filter((c)=>c.id!==chefId))}
              onUpdated={()=>{ }}
            />
          </AccordionDetails>
        </Accordion>
      </Grid>

      <Grid item style={{
        width: '100%',
        maxHeight: '40%',
        marginTop: '0.4em',
        overflow: 'auto',
        order: (maxScore && maxScore < visualRelevancyCutoff) ? '99' : 'inherit'
      }}>
        <span>
          {
            (maxScore && maxScore < visualRelevancyCutoff) ?
              <Typography>We couldn't find anything that seemed very relevant, but here are {searchHits} recipes that might interest you</Typography> :
              <Typography>We found {searchHits} recipes that might interest you...</Typography>
          }
        </span>
        <ResultsList results={results} />
      </Grid>

      <Grid item style={{ width: '100%', maxHeight: '40%', marginTop: '1em' }}>
        <Suggestions forSearchTerm={searchString}
                     updateForcer={suggestionUpdateForcer}
                     showChefs={selectedChefs.length===0} //don't suggest more chefs if we already have one selected
                     chefSelected={(profile)=>{
                       setSelectedChefs((prev)=>prev.concat([profile]));
                       setSearchString("");
                     }}
        ></Suggestions>
      </Grid>
    </Grid>
  </Paper>
}