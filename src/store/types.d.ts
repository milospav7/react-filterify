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

type AnyObject = {
  [key: string]: any;
};

type FilterOption = {
  label: string;
  value: string;
};

type ValueTypedObject<T> = {
  [key: string]: T;
};

type Container = {
  propertyFilters: AnyObject;
  navigationPropertyFilters: AnyObject;
  functionFilters: AnyObject[];
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

type TStyles = ValueTypedObject<CSSProperties>;

type ContainerStyle = {
  styles: {
    label: TStyles;
    input: TStyles;
  };
  highlightWhenInUse: boolean | undefined;
};

export {
  AnyObject,
  ContainerStyleSchema,
  ContainerConfiguration,
  ValueTypedObject,
  Container,
  FilterOption,
  FilterEventHandlers,
  FilterOperator,
  TStyles,
  ContainerStyle,
};
