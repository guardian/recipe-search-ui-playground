import {  z } from 'zod';

export const TitleSearchResult = z.object({
  score: z.number().optional(),
  title: z.string(),
  href: z.string(),
  featuredImage: z.string().optional().nullable(),
  contributors: z.array(z.string()).optional().nullable(),
  byline: z.array(z.string()).optional().nullable(),
  dietIds: z.array(z.string()).optional().nullable(),
});

export type TitleSearchResult = z.infer<typeof TitleSearchResult>;

const KeywordsGenericContent = z.object({
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
  mealTypeIds: KeywordsGenericSlice,
  "celebrationIds.keyword": KeywordsGenericSlice
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
  maxScore: z.number().nullable().optional(),
  results: z.array(TitleSearchResult),
  stats: z.record(z.string(), StatsEntry).optional()
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