import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { valueShouldBeRemoved } from "./helpers";
import { Container } from "./types";

// WORK IN PROGRESS (will replace "old" reducer)

const containerInitialState: Container = {
  propertyFilters: {},
  navigationPropertyFilters: {},
  functionFilters: [],
};

interface IPayload {
  filteringProperty: string;
  filteringValue: any;
}

interface IPropertyFilterUpdate extends IPayload {
  operator: string;
  logic: string;
  allowNullValue: boolean;
}

interface INavigationPropertyFilterUpdate extends IPayload {
  navigationProperty: string;
  generatedExpression: string;
}

interface IFunctionFilterUpdate {
  filteringProperty: string;
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
      const {
        filteringProperty,
        filteringValue,
        operator,
        logic,
        allowNullValue,
      } = action.payload;
      const shouldRemoveFilter =
        !allowNullValue && valueShouldBeRemoved(filteringValue);

      if (shouldRemoveFilter) {
        delete state.propertyFilters[filteringProperty];
      } else {
        state.propertyFilters[filteringProperty] = {
          value: filteringValue,
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
        filteringProperty,
        filteringValue,
        generatedExpression,
      } = action.payload;
      const shouldRemoveFilter = valueShouldBeRemoved(filteringValue);

      if (shouldRemoveFilter) {
        delete state.navigationPropertyFilters[filteringProperty];
      } else {
        state.navigationPropertyFilters[filteringProperty] = {
          value: filteringValue,
          navigationProperty,
          generatedExpression,
        };
      }
    },
    updateFunctionFilter(state, action: PayloadAction<IFunctionFilterUpdate>) {
      const { filteringProperty, filterQueryString, values } = action.payload;
      const shouldRemoveFilter = filterQueryString === null;
      const onlyUpdateExisting = state.functionFilters.some(
        (f) => f.filteringProperty === filteringProperty
      );

      if (shouldRemoveFilter) {
        state.functionFilters = state.functionFilters.filter(
          (f) => f.filteringProperty !== filteringProperty
        );
      } else if (onlyUpdateExisting) {
        state.functionFilters = state.functionFilters.map((f) =>
          f.filteringProperty === filteringProperty
            ? { ...f, queryString: filterQueryString, values }
            : f
        );
      } else {
        // Insert new one
        state.functionFilters.push({
          filteringProperty,
          queryString: filterQueryString,
          values,
        });
      }
    },
    resetAllFilters() {
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

// Extract the action creators object and the reducer
const { actions, reducer } = container;

// Extract and export each action creator by name
export const {
  updatePropertyFilter,
  updateNavigationPropertyFilter,
  resetAllFilters,
} = actions;

// Export the reducer, either as a default or named export
export default reducer;
