import { CSSProperties } from "react";

type FilterStyleSchema = {
  labelFontSize: string;
  placeholderFontSize: string;
  labelColor: string;
  highlightWhenInUse: boolean;
};

type FilterConfiguration = {
  id: string;
  saveToLocalStorage: boolean;
  styleSchema?: FilterStyleSchema;
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
  styleSchema?: null | FilterStyleSchema;
  dateTimeUpdated?: null | string;
};

type FilterComputedOutputs = {
  oDataFilterString: string;
};

type FilterEventHandlers = {
  onChange: (
    _containerState: any,
    processedOutputs: FilterComputedOutputs
  ) => void;
};

type FilterOperator = { operator: string; logic?: string };

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
  FilterStyleSchema,
  FilterConfiguration,
  ValueTypedObject,
  Container,
  FilterOption,
  FilterEventHandlers,
  FilterOperator,
  TStyles,
  ContainerStyle,
};
