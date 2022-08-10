import { CSSProperties } from "react";

type ContainerStyleSchema = {
  labelFontSize: string;
  placeholderFontSize: string;
  labelColor: string;
  highlightWhenInUse: boolean;
};

type ContainerConfiguration = {
  id: string;
  saveToLocalStorage: boolean;
  styleSchema?: ContainerStyleSchema;
};

type FilterOption = {
  label: string;
  value: string;
};

type Container = {
  propertyFilters: Record<string, any>;
  navigationPropertyFilters: Record<string, any>;
  functionFilters: Record<string, any>[];
  saveToLocalStorage?: boolean;
  styleSchema?: null | ContainerStyleSchema;
  dateTimeUpdated?: null | string;
};

type FilterComputedOutputs = {
  oDataFilterString: string;
};

export type FilterChangeEvent = {
  containerState: Container;
  processedOutputs: FilterComputedOutputs;
};

type FilterEventHandlers = {
  onChange: (event: FilterChangeEvent) => void;
};

type FilterOperator = { operator: string; logic?: "and" | "or" };

type TNestedStyles = Record<string, CSSProperties>;

type ContainerStyle = {
  styles: {
    label: TNestedStyles;
    input: TNestedStyles;
  };
  highlightWhenInUse: boolean | undefined;
};

export {
  ContainerStyleSchema,
  ContainerConfiguration,
  Container,
  FilterOption,
  FilterEventHandlers,
  FilterOperator,
  TNestedStyles,
  ContainerStyle,
};
