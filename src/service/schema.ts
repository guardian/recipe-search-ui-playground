import {  z } from 'zod';

export const TitleSearchResult = z.object({
  score: z.number(),
  title: z.string(),
  href: z.string(),
  composerId: z.string()
});

export type TitleSearchResult = z.infer<typeof TitleSearchResult>;

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

export const RecipeSearchResponse = z.object({
  hits: z.number(),
  maxScore: z.number().nullable().optional(),
  results: z.array(TitleSearchResult)
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