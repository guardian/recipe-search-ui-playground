import { Accordion, AccordionDetails, AccordionSummary, css, Grid, Input, Paper, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { DebouncedInput } from './DebouncedInput';
import { useEffect, useState } from 'react';
import { ExpandMore, Label } from '@mui/icons-material';
import { genericKeywordSearch, recipeSearch, RecipeSearchFilters } from '../service/SearchService';
import { CapiProfileTag, StatsEntry, TitleSearchResult } from '../service/schema';
import { ResultsList } from './ResultsList';
import { Suggestions } from './Suggestions';
import { FullSearchForm } from './FullSearchForm';
import { RelatedFilters } from './RelatedFilters';

const visualRelevancyCutoff = 0.75;

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
  const [selectedMealTypes, setSelectedMealTypes] = useState<string[]>([]);
  const [selectedDiets, setSelectedDiets] = useState<string[]>([]);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);

  const [possibleDiets, setPossibleDiets] = useState<StatsEntry|undefined>(undefined);
  const [possibleChefs, setPossibleChefs] = useState<StatsEntry|undefined>(undefined);
  const [possibleCuisines, setPossibleCuisines] = useState<StatsEntry|undefined>(undefined);
  const [possibleMealTypes, setPossibleMealTypes] = useState<StatsEntry|undefined>(undefined);

  const [suggestionUpdateForcer, setSuggestionUpdateForcer] = useState(0);
  const forceSuggestionUpdate = ()=>setSuggestionUpdateForcer(prev=>prev+1);

  const getFilters:()=>RecipeSearchFilters|undefined = ()=>selectedChefs.length > 0 || selectedDiets.length > 0 ? ({
    filterType: "Post",
    contributors: selectedChefs.map(c=>c.id),
    diets: selectedDiets
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
        setPossibleDiets(result.stats["suitableForDietIds"]);
        setPossibleChefs(result.stats["contributors"]);
        setPossibleMealTypes(result.stats["mealTypeIds"]);
        setPossibleCuisines(result.stats["cuisineIds"]);
        forceSuggestionUpdate();
      })
      .catch((err:Error)=>{
        console.error(err.toString())
        setLastError(err.toString())
      });
  }, [searchString, selectedChefs, selectedDiets]);

  useEffect(()=>{
    const shouldExpand = selectedChefs.length > 0 || selectedMealTypes.length > 0 || selectedDiets.length > 0;  //TODO - add more in here as they are implemented
    setSearchExpanded(shouldExpand);
  }, [selectedChefs, selectedMealTypes, selectedDiets])

  const dietTypeSelected = (dt:string)=>{
    setSelectedDiets((prev)=>prev.concat([dt]));
    setSearchString("");
  }

  const chefSelected = (profile:CapiProfileTag|undefined)=>{
    if(profile) {
      setSelectedChefs((prev) => prev.concat([profile]));
      setSearchString("");
    }
  }

  const cuisineSelected = (ct:string) =>{
    setSelectedCuisines((prev)=>prev.concat([ct]));
    setSearchString("");
  }

  const mealTypeSelected = (mt:string)=>{
    setSelectedMealTypes((prev)=>prev.concat([mt]));
    setSearchString("");
  }

  /**
   * Calculate the minimum score for which we should keep showing results.
   * - if there is no search term, then display everything
   * - if the highest score in the result is greater than our visual relevancy cutoff, then only display those
   * - if the highest score in the result is lower than the visual relevancy cutoff, then reduce it to display more results
   * (but signal that these results are less relevant)
   */
  const effectiveCutoff = () => {
    if(!searchString || searchString==="") {
      return 0;
    }
    return (maxScore && maxScore  > visualRelevancyCutoff) ? visualRelevancyCutoff : 0.6
  }

  const weHaveNoRelevantResults = maxScore && maxScore < visualRelevancyCutoff && searchString!=="";

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
                <DebouncedInput placeholder="Find me a recipe, or a chef, or a meal type, or a suggestion..." type="text" id="searchbox"
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
              mealTypes={selectedMealTypes}
              diets={selectedDiets}
              cuisines={selectedCuisines}
              onChefRemoved={(chefId)=>setSelectedChefs((prev)=>prev.filter((c)=>c.id!==chefId))}
              onMealTypeRemoved={(mealId)=>setSelectedMealTypes((prev)=>prev.filter((mt)=>mt!==mealId))}
              onDietRemoved={(dietId)=>setSelectedDiets((prev)=>prev.filter(d=>d!==dietId))}
              onCuisineRemoved={(cuisineId)=>setSelectedCuisines((prev)=>prev.filter((ct)=>ct!==cuisineId))}
            />
          </AccordionDetails>
        </Accordion>
      </Grid>

      <Grid item style={{
        width: '100%',
        maxHeight: '40%',
        marginTop: '0.4em',
        overflow: 'auto',
        order: weHaveNoRelevantResults ? '90' : 'inherit'
      }}>
        <span>
          {
            weHaveNoRelevantResults ?
              <Typography>We couldn't find any recipes that seemed very relevant, but here are some that might interest you</Typography> :
              <Typography>We found {searchHits} recipes that might interest you...</Typography>
          }
        </span>
        <ResultsList results={results} showScore scoreCutoff={effectiveCutoff()}/>
      </Grid>

      <Grid item style={{ width: '100%', maxHeight: '40%', marginTop: '1em', order: weHaveNoRelevantResults ? '99' : 'inherit'}}>
        <RelatedFilters dietTypeSelected={dietTypeSelected}
                        chefSelected={chefSelected}
                        cuisineSelected={cuisineSelected}
                        mealTypeSelected={mealTypeSelected}
                        chefs={possibleChefs}
                        diets={possibleDiets}
                        cuisines={possibleCuisines}
                        mealTypes={possibleMealTypes}
        />
      </Grid>

      { searchString !== "" ?
      <Grid item style={{ width: '100%', maxHeight: '40%', marginTop: '1em' }}>
        <Suggestions forSearchTerm={searchString}
                     updateForcer={suggestionUpdateForcer}
                     showChefs={selectedChefs.length===0} //don't suggest more chefs if we already have one selected
                     chefSelected={chefSelected}
                     mealTypeSelected={(mt)=>{
                       setSelectedMealTypes((prev)=>prev.concat([mt]));
                       setSearchString("");
                     }}
                     dietTypeSelected={dietTypeSelected}
                     cuisineSelected={cuisineSelected}
        ></Suggestions>
      </Grid> : undefined }

    </Grid>
  </Paper>
}