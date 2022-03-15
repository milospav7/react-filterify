import { ValueTypedObject } from "../../store/types";

const operatorSymbols: ValueTypedObject<string> = {
  contains: "contains",
  doesnotcontain: "doesnotcontain",
  startswith: "startswith",
  endswith: "endswith",
  eq: "eq",
  ne: "ne",
};

//** TODO: should be moved in filter generator part and handled by centralized mechanism. Filter component should ony dispatch type of filter, it's value and selected operator, no need to determine any custom expression from ui components  */
const generateCustomExpression = (
  filteringProperty: string,
  opr: string,
  value: string
) => {
  let generatedExpression = "";

  if (opr === "eq" || opr === "ne")
    generatedExpression = `(s/${filteringProperty} ${opr} '${value}')`;
  else if (opr === "contains")
    generatedExpression = `contains(s/${filteringProperty}, '${value}')`;
  else if (opr === "doesnotcontain")
    generatedExpression = `(indexof(s/${filteringProperty}, '${value}') eq -1)`;
  else if (opr === "startswith" || opr === "endswith")
    generatedExpression = `${opr}(s/${filteringProperty}, '${value}')`;

  return generatedExpression;
};

export { operatorSymbols, generateCustomExpression };
