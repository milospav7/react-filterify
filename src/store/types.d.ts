type FilterStyleSchemaType = {
  labelFontSize: string | number;
  placeholderFontSize: string | number;
  labelColor: string;
  placeholderColor: string;
  highlightWhenInUse: boolean;
};

type FilterConfigurationType = {
  id: string;
  saveToLocalStorage: boolean;
  globalStyleSchema?: FilterStyleSchemaType;
};

type AnyObject = {
  [key: string]: any;
};

type ValueTypedObject<T> = Map<string, T>;

type ContainerType = {
  propertyFilters: AnyObject;
  navigationPropertyFilters: AnyObject;
  functionFilters: AnyObject[];
  saveToLocalStorage: boolean;
  globalStyleSchema?: FilterStyleSchemaType;
};

export {
  AnyObject,
  FilterStyleSchemaType,
  FilterConfigurationType,
  ValueTypedObject,
  ContainerType,
};
