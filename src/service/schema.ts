import { number, z } from 'zod';

const TitleSearchResult = z.object({
  score: z.number(),
  title: z.string(),
  href: z.string(),
  composerId: z.string()
});

const KeywordsGenericContent = z.object({
  hits: z.number(),
  maxScore: z.number().nullable().optional(),
  results: z.array(TitleSearchResult)
});

const KeywordsGenericSlice = z.object({
  matches: z.array(z.string()),
  content: KeywordsGenericContent
});

export const KeywordsGenericSearchResponse = z.object({
  suitableForDietIds: KeywordsGenericSlice,
  contributor_names: KeywordsGenericSlice,
  cuisineIds: KeywordsGenericSlice,
  byline: KeywordsGenericSlice,
  mealTypeIds: KeywordsGenericSlice
});

export type KeywordsGenericSearchResponse = z.infer<typeof KeywordsGenericSearchResponse>;