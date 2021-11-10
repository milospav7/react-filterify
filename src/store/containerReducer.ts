import { serializeFilter } from "../utils/odata-filtering.operators";
import {
  UPDATE_FILTER,
  RESET_ALL_FILTERS,
  UPDATE_NAVIGATION_PROPERTY_FILTER,
  UPDATE_FUNCTION_FILTER,
  RESET_POPERTY_FILTERS,
  OVERRIDE_STATE,
  UPDATE_MULTIPLE_FUNCTION_FILTERS,
} from "./actionTypes";
import {
  cloneDeep,
  valueShouldBeRemoved,
  isBoolean,
  removeKey,
  concatFilterQuerySubstrings,
} from "./helpers";
import { ContainerType } from "./types";

export const containerInitialState: ContainerType = {
  propertyFilters: {},
  navigationPropertyFilters: {},
  functionFilters: [],
};

export const containerReducer = (
  state = containerInitialState,
  action: any
) => {
  switch (action.type) {
    case UPDATE_FILTER: {
      const {
        filteringProperty,
        filteringValue,
        operator,
        logic,
        allowNullValue,
      } = action;
      const shouldRemoveFilter =
        !allowNullValue && valueShouldBeRemoved(filteringValue);

      if (shouldRemoveFilter) {
        return {
          ...state,
          propertyFilters: {
            ...removeKey(filteringProperty, state.propertyFilters),
          },
        };
      }

      return {
        ...state,
        propertyFilters: {
          ...state.propertyFilters,
          [filteringProperty]: {
            value: filteringValue,
            operator,
            logic,
          },
        },
      };
    }
    case UPDATE_NAVIGATION_PROPERTY_FILTER: {
      const {
        navigationProperty,
        filteringProperty,
        filteringValue,
        generatedExpression,
        navigationPropertyIsNested,
      } = action;
      const shouldRemoveFilter = valueShouldBeRemoved(filteringValue);

      if (shouldRemoveFilter) {
        return {
          ...state,
          navigationPropertyFilters: {
            ...removeKey(filteringProperty, state.navigationPropertyFilters),
          },
        };
      }

      return {
        ...state,
        navigationPropertyFilters: {
          ...state.navigationPropertyFilters,
          [filteringProperty]: {
            value: filteringValue,
            navigationProperty,
            generatedExpression,
            navigationPropertyIsNested,
          },
        },
      };
    }
    case UPDATE_FUNCTION_FILTER: {
      const { filteringProperty, filterQueryString, values } = action;
      const shouldRemoveFilter = filterQueryString === null;

      if (shouldRemoveFilter) {
        return {
          ...state,
          functionFilters: state.functionFilters.filter(
            (f) => f.filteringProperty !== filteringProperty
          ),
        };
      }

      const onlyUpdateExisting = state.functionFilters.some(
        (f) => f.filteringProperty === filteringProperty
      );

      if (onlyUpdateExisting) {
        return {
          ...state,
          functionFilters: state.functionFilters.map((f) =>
            f.filteringProperty === filteringProperty
              ? { ...f, queryString: filterQueryString, values }
              : f
          ),
        };
      }

      // Insert new one
      return {
        ...state,
        functionFilters: [
          ...state.functionFilters,
          {
            filteringProperty,
            queryString: filterQueryString,
            values,
          },
        ],
      };
    }
    case UPDATE_MULTIPLE_FUNCTION_FILTERS: {
      const { filtersToUpdate } = action;

      filtersToUpdate.forEach((filter: any) => {
        const { filteringProperty, filterQueryString, values } = filter;

        if (filterQueryString) {
          const updateExisting = state.functionFilters.some(
            (f) => f.filteringProperty === filteringProperty
          );
          if (updateExisting)
            return {
              ...state,
              functionFilters: state.functionFilters.map((f) =>
                f.filteringProperty === filteringProperty
                  ? { ...f, queryString: filterQueryString, values }
                  : f
              ),
            };
          else
            return {
              ...state,
              functionFilters: [
                ...state.functionFilters,
                {
                  filteringProperty,
                  queryString: filterQueryString,
                  values,
                },
              ],
            };
        }
        // Remove
        else
          return {
            ...state,
            functionFilters: state.functionFilters.filter(
              (f) => f.filteringProperty !== filteringProperty
            ),
          };
      });

      return state;
    }
    case RESET_ALL_FILTERS: {
      return {
        ...state,
        ...containerInitialState,
      };
    }
    case RESET_POPERTY_FILTERS: {
      const filteringProperties: any[] = action.filteringProperties;

      let modifiedPropertyFiltetrs = cloneDeep(state.propertyFilters);

      filteringProperties.forEach((filter) => {
        if (state.propertyFilters[filter])
          modifiedPropertyFiltetrs = removeKey(
            filter,
            modifiedPropertyFiltetrs
          );
      });
      return {
        ...state,
        propertyFilters: modifiedPropertyFiltetrs,
      };
    }
    case OVERRIDE_STATE: {
      const { filterState } = action;

      return {
        propertyFilters:
          filterState?.propertyFilters ?? containerInitialState.propertyFilters,
        navigationPropertyFilters:
          filterState?.navigationPropertyFilters ??
          containerInitialState.navigationPropertyFilters,
        functionFilters:
          filterState?.functionFilters ?? containerInitialState.functionFilters,
      };
    }
    default:
      return state;
  }
};

// All helper methods process only data from filter instances, created with this filter reducer
export class FilterHelperMethods {
  /**
   * Method will use propertyFilters, navigationPropertyFilters and functionFilters(objects and array from filter instance) to generate kendo filter object that GenericDataGrid can use when calling getMethod, in order to filter data
   * @param {Object} filters propertyFilters map - part of filter instance state
   * @param {Object[]} functionFilters functionFilters array - part of filter instance state
   * @param {Object} navigationPropertyFilters navigationPropertyFilters map - part of filter instance state
   */
  static getFilterStrings = (
    filters: any,
    functionFilters = null,
    navigationPropertyFilters = null
  ) => {
    const propertyFilters: any = {
      logic: "and",
      filters: [],
    };

    const filterQueryStrings: any = {
      propertyFiltersQueryString: "",
      functionFiltersQueryString:
        FilterHelperMethods.getFunctionFiltersQueryString(functionFilters),
      navigationPropertyFilterQueryString:
        FilterHelperMethods.getNavigationPropFiltersQueryString(
          navigationPropertyFilters
        ),
    };

    Object.keys(filters).forEach((k) => {
      const filterValue = filters[k].value;
      const operator = filters[k].operator ?? "eq";
      const filterType = filters[k].type;
      const logic = filters[k].logic ?? "or";

      if (
        !Array.isArray(filterValue) &&
        (filterValue instanceof Date || filterType === "datetime")
      ) {
        const value =
          typeof filterValue === "string" ? new Date(filterValue) : filterValue; // Need this check because when parsing stringified object from local storage then Datetime object becomes string so we need to convert it back to Date object
        propertyFilters.filters.push({
          field: k,
          value,
          operator,
          key: k,
        });
      } else if (
        typeof filterValue === "string" ||
        typeof filterValue === "number" ||
        typeof filterValue === "boolean" ||
        filterValue === null
      ) {
        if (k.includes(";")) {
          // Multi-filter (filtering more than one fields with one filter by using field name like 'Field1;Field2;Field3')
          const multiFilter: any = {
            key: k,
            filters: [],
            logic,
          };
          propertyFilters.filters.push(multiFilter);

          k.split(";").forEach((field) => {
            multiFilter.filters.push({
              field,
              value: filterValue,
              operator,
            });
          });
        } else
          propertyFilters.filters.push({
            field: k,
            value: filterValue,
            operator,
            key: k,
          });
      } else if (Array.isArray(filterValue) && filterValue.length > 0) {
        propertyFilters.filters.push({
          key: k,
          filters: [],
          logic,
        });
        filterValue.forEach((v, ind) => {
          const value = v.value ? v.value : v;
          const isDateTime = filterType === "datetime";
          const multipleOperators = Array.isArray(operator);
          const filterOperator = multipleOperators ? operator[ind] : operator;

          const proccessedValue =
            isDateTime && typeof value === "string" ? new Date(value) : value; // Need this check because when parsing stringified object from local storage then Datetime object becomes string so we need to convert it back to Date object
          const index = propertyFilters.filters.findIndex(
            (f: any) => f.key === k
          );

          if (index >= 0) {
            let filterToAssign = {
              field: k,
              value: proccessedValue,
              operator: filterOperator,
            };
            if (v.value) filterToAssign = { ...filterToAssign, ...v };
            propertyFilters.filters[index].filters.push(filterToAssign);
          }
        });
      }
    });

    filterQueryStrings.propertyFiltersQueryString =
      serializeFilter(propertyFilters);

    return filterQueryStrings;
  };

  /**
   * Method will use navigationPropertyFilters map(from filter instance) to generate query string(with lambdas (and lambda custom expressions)). Should be used in conjunction with upper method and then both results should be passed, as args, to toODataStr method to get complete query string for grid method request
   * @param {Object} navigationPropertyFilters
   */
  static getNavigationPropFiltersQueryString = (
    navigationPropertyFilters: any
  ) => {
    if (!navigationPropertyFilters || navigationPropertyFilters.length === {})
      return null;
    let groupedFilters: any = [];
    let query = "";

    Object.keys(navigationPropertyFilters).forEach((f) => {
      const filter = navigationPropertyFilters[f];

      if (
        groupedFilters.some(
          (gf: any) => gf.navigationProperty === filter.navigationProperty
        )
      ) {
        groupedFilters = groupedFilters.map((gf: any) => {
          if (gf.navigationProperty === filter.navigationProperty) {
            return {
              navigationProperty: filter.navigationProperty,
              values: filter.generatedExpression
                ? gf.values
                : [...gf.values, { field: f, value: filter.value }],
              generatedExpressions: filter.generatedExpression
                ? [...gf.generatedExpressions, filter.generatedExpression]
                : gf.generatedExpressions,
              navigationPropertyIsNested: filter.navigationPropertyIsNested,
            };
          }
          return gf;
        });
      } else {
        groupedFilters.push({
          navigationProperty: filter.navigationProperty,
          values: filter.generatedExpression
            ? []
            : [{ field: f, value: filter.value }],
          generatedExpressions: filter.generatedExpression
            ? [filter.generatedExpression]
            : [],
          navigationPropertyIsNested: filter.navigationPropertyIsNested,
        });
      }
    });

    if (groupedFilters.length > 0) {
      groupedFilters.forEach((f: any, ind: number) => {
        const multipleLevelNavigationProperty =
          f.navigationProperty.indexOf("/") >= 0 &&
          f.navigationPropertyIsNested;

        const splittedName = f.navigationProperty.split("/");
        const navPropName = multipleLevelNavigationProperty
          ? splittedName.slice(0, splittedName.length - 1).join("/")
          : f.navigationProperty;
        const subNavPropName = multipleLevelNavigationProperty
          ? splittedName[splittedName.length - 1]
          : null;

        // Here we can see one limitation of this helper method => we are forced to use 's' as input parameter in lambda expression when populating filters
        // We can add mechanism to support any other letter but since the scope of this method is not big(only few of us devs are using this), then we should not add additional complexity just for that purpose
        if (multipleLevelNavigationProperty)
          query += `${navPropName}/any(x: x/${subNavPropName}/any(s: {expressionPart}))`;
        else query += `${navPropName}/any(s: {expressionPart})`;
        let expressionPart = "";

        if (f.generatedExpressions && f.generatedExpressions.length > 0) {
          f.generatedExpressions.forEach((ce: any, i: number) => {
            if (i === f.generatedExpressions.length - 1)
              expressionPart += ` ${ce}`;
            else expressionPart += ` ${ce} and`;
          });
        }

        if (f.values && f.values.length > 0) {
          if (expressionPart) expressionPart += " and";
          f.values.forEach((v: any, index: number) => {
            if (Array.isArray(v.value) && v.value.length > 0) {
              expressionPart += ` (`;
              v.value.forEach((vv: any, i: number) => {
                let value = vv.value ? vv.value : vv;
                if (!isBoolean(value)) value = `'${value}'`;
                if (i === v.value.length - 1)
                  expressionPart += ` s/${v.field} eq ${value})`;
                else expressionPart += ` s/${v.field} eq ${value} or`;
              });
            } else {
              let value = v.value;
              if (!isBoolean(value)) value = `'${value}'`;
              expressionPart += ` (s/${v.field} eq ${value})`;
            }
            if (index < f.values.length - 1) expressionPart += " and";
          });
        }

        query = query.replace("{expressionPart}", expressionPart);
        if (ind < groupedFilters.length - 1) query += " and ";
      });
    }
    return query;
  };

  /**
   * Concats function filter strings into one string
   * @param {Object[]} functionFilters function filters array - part of filter instance
   */
  static getFunctionFiltersQueryString = (functionFilters: any) => {
    let queryString = "";
    if (Array.isArray(functionFilters) && functionFilters.length > 0) {
      functionFilters.forEach((ff, ind) => {
        if (ind === 0) queryString += `${ff.queryString}`;
        else queryString += ` and ${ff.queryString}`;
      });
    }
    return queryString;
  };

  static generateODataFilterString = (filters: any) => {
    const {
      propertyFiltersQueryString,
      navigationPropertyFilterQueryString,
      functionFiltersQueryString,
    } = FilterHelperMethods.getFilterStrings(
      filters.propertyFilters,
      filters.functionFilters,
      filters.navigationPropertyFilters
    );

    const odataFilterQuery = concatFilterQuerySubstrings(
      propertyFiltersQueryString,
      navigationPropertyFilterQueryString,
      functionFiltersQueryString
    );

    return odataFilterQuery.replace(
      /('[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}')/gi,
      (x) => x.substring(1, x.length - 1)
    );
  };
}
