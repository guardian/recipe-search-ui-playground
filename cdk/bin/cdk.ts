import "source-map-support/register";
import { GuRoot } from "@guardian/cdk/lib/constructs/root";
import { RecipeSearchUiPlayground } from "../lib/recipe-search-ui-playground";

const app = new GuRoot();
new RecipeSearchUiPlayground(app, "RecipeSearchUiPlayground-euwest-1-PROD", {
  stack: "feast",
  stage: "PROD",
  app: "recipe-search-ui-playground",
  env: { region: "eu-west-1" }
});
