import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { valueShouldBeRemoved } from "./helpers";
import { Container } from "./types";

export const containerInitialState: Container = {
  propertyFilters: {},
  navigationPropertyFilters: {},
  functionFilters: [],
};

interface IBasePayload {
  containerId: string;
}

interface IPayload extends IBasePayload {
  property: string;
  filterValue: any;
}

interface IPropertyFilterUpdate extends IPayload {
  operator: string;
  logic: "and" | "or";
  allowNullValue?: boolean;
}

interface INavigationPropertyFilterUpdate extends IPayload {
  navigationProperty: string;
  generatedExpression?: string;
  operator: string;
}

interface IFunctionFilterUpdate {
  property: string;
  filterQueryString: string;
  values: any;
}

interface IOverridedFilters {
  propertyFilters?: any;
  navigationPropertyFilters?: any;
  functionFilters?: any[];
}

const container = createSlice({
  name: "[FILTERIFY_CONTAINER]",
  initialState: containerInitialState,
  reducers: {
    updatePropertyFilter(state, action: PayloadAction<IPropertyFilterUpdate>) {
      const { property, filterValue, operator, logic, allowNullValue } =
        action.payload;
      const shouldRemoveFilter =
        !allowNullValue && valueShouldBeRemoved(filterValue);

      if (shouldRemoveFilter) {
        delete state.propertyFilters[property];
      } else {
        state.propertyFilters[property] = {
          value: filterValue,
          operator,
          logic,
        };
      }
    },
    updateNavigationPropertyFilter(
      state,
      action: PayloadAction<INavigationPropertyFilterUpdate>
    ) {
      const {
        navigationProperty,
        property,
        filterValue,
        generatedExpression,
        operator,
      } = action.payload;
      const shouldRemoveFilter = valueShouldBeRemoved(filterValue);

      if (shouldRemoveFilter) {
        delete state.navigationPropertyFilters[property];
      } else {
        state.navigationPropertyFilters[property] = {
          value: filterValue,
          navigationProperty,
          generatedExpression,
          operator,
        };
      }
    },
    updateFunctionFilter(state, action: PayloadAction<IFunctionFilterUpdate>) {
      const { property, filterQueryString, values } = action.payload;
      const shouldRemoveFilter = filterQueryString === null;
      const onlyUpdateExisting = state.functionFilters.some(
        (f) => f.property === property
      );

      if (shouldRemoveFilter) {
        state.functionFilters = state.functionFilters.filter(
          (f) => f.property !== property
        );
      } else if (onlyUpdateExisting) {
        state.functionFilters = state.functionFilters.map((f) =>
          f.property === property
            ? { ...f, queryString: filterQueryString, values }
            : f
        );
      } else {
        // Insert new one
        state.functionFilters.push({
          property,
          queryString: filterQueryString,
          values,
        });
      }
    },
    resetAllFilters(_state, _action: PayloadAction<IBasePayload>) {
      return { ...containerInitialState };
    },
    overrideFilters(state, action: PayloadAction<IOverridedFilters>) {
      const { propertyFilters, navigationPropertyFilters, functionFilters } =
        action.payload;
      if (propertyFilters) state.propertyFilters = propertyFilters;
      if (navigationPropertyFilters)
        state.navigationPropertyFilters = propertyFilters;
      if (functionFilters) state.functionFilters = functionFilters;
    },
  },
});

export const {
  actions: {
    updatePropertyFilter,
    updateNavigationPropertyFilter,
    resetAllFilters,
  },
  reducer: containerReducer,
} = container;
