import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { RecipeSearchUiPlayground } from "./recipe-search-ui-playground";

describe("The RecipeSearchUiPlayground stack", () => {
  it("matches the snapshot", () => {
    const app = new App();
    const stack = new RecipeSearchUiPlayground(app, "RecipeSearchUiPlayground", { stack: "content-api", stage: "TEST" });
    const template = Template.fromStack(stack);
    expect(template.toJSON()).toMatchSnapshot();
  });
});
