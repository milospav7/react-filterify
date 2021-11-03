type FilterStyleSchemaType = {
  labelFontSize: string | number;
  placeholderFontSize: string | number;
  labelColor: string;
  placeholderColor: string;
  highlightWhenInUse: boolean;
};

type DetailedConfigurationType = {
  id: string;
  saveToLocalStorage: boolean;
  styleSchema?: FilterStyleSchemaType;
};

type FilterConfigurationType = string | DetailedConfigurationType;

type AnyObject = {
  [key: string]: any;
};

type ValueTypedObject<T> = {
  [key: string]: T;
};

type ContainerType = {
  propertyFilters: AnyObject;
  navigationPropertyFilters: AnyObject;
  functionFilters: AnyObject[];
  saveToLocalStorage: boolean;
  styleSchema: null | FilterStyleSchemaType;
  dateTimeUpdated: null | string;
};

export {
  AnyObject,
  FilterStyleSchemaType,
  FilterConfigurationType,
  ValueTypedObject,
  ContainerType,
};
