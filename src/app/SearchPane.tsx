import {
  Accordion,
  AccordionDetails,
  AccordionSummary, Alert,
  css,
  Grid, IconButton,
  LinearProgress, MenuItem,
  Paper,
  Select, Snackbar,
  Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { DebouncedInput } from './DebouncedInput';
import { useEffect, useState } from 'react';
import { Close, Error, ExpandMore } from '@mui/icons-material';
import { recipeSearch, RecipeSearchFilters, SearchTypes } from '../service/SearchService';
import { CapiProfileTag, StatsEntry, TitleSearchResult } from '../service/schema';
import { ResultsList } from './ResultsList';
import { Suggestions } from './Suggestions';
import { FullSearchForm } from './FullSearchForm';
import { RelatedFilters } from './RelatedFilters';

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
      align-items: center;
  `;

  const growable = css`
    flex-grow: 1;
  `;

  const [searchString, setSearchString] = useState("");
  const [lastError, setLastError] = useState<string|undefined>();

  const [searchExpanded, setSearchExpanded] = useState(false);

  const [maxScore, setMaxScore] = useState(0);
  const [results, setResults] = useState<TitleSearchResult[]>([]);

  const [selectedChefs, setSelectedChefs] = useState<CapiProfileTag[]>([]);
  const [selectedMealTypes, setSelectedMealTypes] = useState<string[]>([]);
  const [selectedDiets, setSelectedDiets] = useState<string[]>([]);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);

  //visualRelevancyCutoff is the score below which a match is treated as unreliable
  //visualHardCutoff is the score below which is definitely noise and should not be displayed
  const [visualRelevancyCutoff, setVisualRelevancyCutoff] = useState(0.7);
  const [visualHardCutoff, setVisualHardCutoff] = useState(0.6);

  const [possibleDiets, setPossibleDiets] = useState<StatsEntry|undefined>(undefined);
  const [possibleChefs, setPossibleChefs] = useState<StatsEntry|undefined>(undefined);
  const [possibleCuisines, setPossibleCuisines] = useState<StatsEntry|undefined>(undefined);
  const [possibleMealTypes, setPossibleMealTypes] = useState<StatsEntry|undefined>(undefined);

  const [searchMode, setSearchMode] = useState<SearchTypes>("Embedded");

  const [loading, setLoading] = useState(false);

  const [suggestionUpdateForcer, setSuggestionUpdateForcer] = useState(0);
  const forceSuggestionUpdate = ()=>setSuggestionUpdateForcer(prev=>prev+1);

  const getFilters:()=>RecipeSearchFilters|undefined = ()=> {
    const chefIds = selectedChefs.map(c=>c.id);

    return {
      filterType: "Post",
      contributors: chefIds.length === 0 ? undefined : chefIds,
      diets: selectedDiets.length === 0 ? undefined : selectedDiets,
      cuisines: selectedCuisines.length===0 ? undefined : selectedCuisines,
      mealTypes: selectedMealTypes.length===0 ? undefined : selectedMealTypes
    };
  }

  useEffect(() => {
    //TODO - temporary fix - the server should be giving us this information
    switch(searchMode) {
      case "Embedded":
        setVisualRelevancyCutoff(0.7);
        setVisualHardCutoff(0.6)
        break;
      case "WeightedHybridSum":
        setVisualRelevancyCutoff(0.5);
        setVisualHardCutoff(0.4);
        break;
      default:
        setVisualRelevancyCutoff(0);
        setVisualHardCutoff(0);
    }
  }, [searchMode]);

  useEffect(()=>{
    setLoading(true);
    recipeSearch({
      queryText: searchString,
      searchType: searchMode,
      filters: getFilters(),
    })
      .then((result)=>{
        if(result.maxScore) setMaxScore(result.maxScore);
        setResults(result.results);
        setPossibleDiets(result.stats? result.stats["suitableForDietIds"] : undefined);
        setPossibleChefs(result.stats? result.stats["contributors"] : undefined);
        setPossibleMealTypes(result.stats? result.stats["mealTypeIds"] : undefined);
        setPossibleCuisines(result.stats? result.stats["cuisineIds"] : undefined);
        forceSuggestionUpdate();
        setLoading(false);
      })
      .catch((err:Error)=>{
        console.error(err.toString())
        setLastError(err.toString());
        setLoading(false);
      });
  }, [searchString, selectedChefs, selectedDiets, selectedMealTypes, selectedCuisines, searchMode]);

  useEffect(()=>{
    //TODO - add more in here as they are implemented
    const shouldExpand = selectedChefs.length > 0 || selectedMealTypes.length > 0 || selectedDiets.length > 0;
    setSearchExpanded(shouldExpand);
  }, [selectedChefs, selectedMealTypes, selectedDiets])

  const dietTypeSelected = (dt:string)=>{
    setSelectedDiets((prev)=>prev.concat([dt]));
  }

  const chefSelected = (profile:CapiProfileTag|undefined)=>{
    if(profile) {
      setSelectedChefs((prev) => prev.concat([profile]));
    }
  }

  const cuisineSelected = (ct:string) =>{
    setSelectedCuisines((prev)=>prev.concat([ct]));
  }

  const mealTypeSelected = (mt:string)=>{
    setSelectedMealTypes((prev)=>prev.concat([mt]));
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
    return (maxScore && maxScore  > visualRelevancyCutoff) ? visualRelevancyCutoff : visualHardCutoff
  }

  const weHaveNoRelevantResults = maxScore && maxScore < visualRelevancyCutoff && searchString!=="";

  return <Paper css={searchPaneBase} elevation={3}>
    {
      lastError ? <Snackbar open={true} autoHideDuration={30000} onClose={()=>setLastError(undefined)}>
        <Alert severity="error" icon={<Error/>}>
          {lastError} <IconButton onClick={()=>setLastError(undefined)}><Close/></IconButton>
        </Alert>
      </Snackbar> : undefined
    }
    <Grid container direction="column" columns={1} style={{flexFlow: "column"}}>

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
              <Grid item>
                <Select id="modeSelector" value={searchMode} onChange={(evt)=>setSearchMode(evt.target.value as SearchTypes)}>
                  <MenuItem value="Embedded">Embedded</MenuItem>
                  <MenuItem value="WeightedHybridSum">Hybrid</MenuItem>
                  <MenuItem value="Lucene">Lucene</MenuItem>
                  <MenuItem value="Match">Text match</MenuItem>
                </Select>
              </Grid>
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
        {
          loading ? <LinearProgress style={{width: "100%"}}/> : undefined
        }
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
              <Typography>These recipes might interest you...</Typography>
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
                     chefSelected={(p)=>{
                       chefSelected(p);
                       setSearchString("");
                     }}
                     mealTypeSelected={(mt)=>{
                       setSelectedMealTypes((prev)=>prev.concat([mt]));
                       setSearchString("");
                     }}
                     dietTypeSelected={(d)=>{
                       dietTypeSelected(d);
                       setSearchString("");
                     }}
                     cuisineSelected={(c)=>{
                       cuisineSelected(c);
                       setSearchString("");
                     }}
                     errorCb={setLastError}
        ></Suggestions>
      </Grid> : undefined }

    </Grid>
  </Paper>
}