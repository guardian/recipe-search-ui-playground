import { number, z } from 'zod';

export const TitleSearchResult = z.object({
  score: z.number(),
  title: z.string(),
  href: z.string(),
  composerId: z.string()
});

export type TitleSearchResult = z.infer<typeof TitleSearchResult>;

const GenericRange = z.object({
  min: z.number(),
  max: z.number()
});
const RecipeServes = z.object({
  amount: GenericRange,
  text: z.string().optional().nullable(),
  unit: z.string().optional().nullable()
});

export const FullSearchDataResult = z.object({
  score: z.number().optional().nullable(),
  href: z.string(),
  contributor_names: z.array(z.string()),
  bookCredit: z.string().optional().nullable(),
  canonicalArticle: z.string(),
  celebrationIds: z.array(z.string()).optional().nullable(),
  composerId: z.string().optional(),
  contributors: z.array(z.string()),
  cuisineIds: z.array(z.string()).optional().nullable(),
  description: z.string(),
  difficultyLevel: z.string().optional().nullable(),
  id: z.string(),
  instructions: z.array(z.string()),
  mealTypeIds: z.array(z.string()).optional().nullable(),
  serves: z.array(RecipeServes),
  suitableForDietIds: z.array(z.string()).optional().nullable(),
  //don't have data on timings right now but that should be here!
  title: z.string(),
  byline: z.array(z.string())
});

export type FullSearchDataResult = z.infer<typeof FullSearchDataResult>;

const KeywordsGenericContent = z.object({
  hits: z.number(),
  maxScore: z.number().nullable().optional(),
  results: z.array(TitleSearchResult)
});

export const KeywordsGenericSlice = z.object({
  matches: z.array(z.string()),
  content: KeywordsGenericContent
});

export type KeywordsGenericSlice = z.infer<typeof KeywordsGenericSlice>;

export const KeywordsGenericSearchResponse = z.object({
  suitableForDietIds: KeywordsGenericSlice,
  contributor_names: KeywordsGenericSlice,
  cuisineIds: KeywordsGenericSlice,
  byline: KeywordsGenericSlice,
  mealTypeIds: KeywordsGenericSlice
});

export type KeywordsGenericSearchResponse = z.infer<typeof KeywordsGenericSearchResponse>;

export const StatsEntry = z.object({
  doc_count_error_upper_bound: z.number().optional(),
  sum_doc_other_count: z.number().optional(),
  buckets: z.array(z.object({
    key: z.string(),
    doc_count: z.number()
  }))
});

export type StatsEntry = z.infer<typeof StatsEntry>;

export const RecipeSearchResponse = z.object({
  hits: z.number(),
  maxScore: z.number().nullable().optional(),
  results: z.array(z.union([TitleSearchResult,FullSearchDataResult])),
  stats: z.record(z.string(), StatsEntry)
});

export type RecipeSearchResponse = z.infer<typeof RecipeSearchResponse>;

const RecipeImage = z.object({
  url: z.string()
});

export const FullRecipe = z.object({
  canonicalArticle: z.string().optional().nullable(),
  cuisineIds: z.array(z.string()),
  description: z.string(),
  featuredImage: RecipeImage,
  id: z.string(),
  title: z.string(),
});

export type FullRecipe = z.infer<typeof FullRecipe>;

export const CapiProfileTag = z.object({
  id: z.string(),
  type: z.string(),
  bylineImageUrl: z.string().optional(),
  webTitle: z.string()
});
export type CapiProfileTag = z.infer<typeof CapiProfileTag>;

export const CapiProfileResponse = z.object({
  response: z.object({
    tag: CapiProfileTag
  })
});

export type CapiProfileResponse = z.infer<typeof CapiProfileResponse>;