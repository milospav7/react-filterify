import { CSSProperties } from "react";

type FilterStyleSchemaType = {
  labelFontSize: string;
  placeholderFontSize: string;
  labelColor: string;
  highlightWhenInUse: boolean;
};

type FilterConfigurationType = {
  id: string;
  saveToLocalStorage: boolean;
  styleSchema?: FilterStyleSchemaType;
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

type ContainerType = {
  propertyFilters: AnyObject;
  navigationPropertyFilters: AnyObject;
  functionFilters: AnyObject[];
  saveToLocalStorage?: boolean;
  styleSchema?: null | FilterStyleSchemaType;
  dateTimeUpdated?: null | string;
};

type FilterProcessedOutputsType = {
  oDataFilterString: string;
};

type FilteringEventHandlersType = {
  onChange: (
    _containerState: any,
    processedOutputs: FilterProcessedOutputsType
  ) => void;
};

type FilterOperatorType = { operator: string; logic?: string };

type TStyles = ValueTypedObject<CSSProperties>;

type TContainerStyle = {
  styles: {
    label: TStyles;
    input: TStyles;
  };
  highlightWhenInUse: boolean | undefined;
};

export {
  AnyObject,
  FilterStyleSchemaType,
  FilterConfigurationType,
  ValueTypedObject,
  ContainerType,
  FilterOption,
  FilteringEventHandlersType,
  FilterOperatorType,
  TStyles,
  TContainerStyle,
};
