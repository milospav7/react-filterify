import {
  FILTER_UPDATE_FILTER,
  FILTER_RESET_ALL_FILTERS,
  FILTER_UPDATE_NAVIGATION_PROPERTY_FILTER,
  FILTER_UPDATE_FUNCTION_FILTER,
  FILTER_RESET_POPERTY_FILTERS,
  FILTER_OVERRIDE_FILTER_STATE,
  FILTER_UPDATE_MULTIPLE_FUNCTION_FILTERS,
} from "./actionTypes";
import { ContainerType } from "./types";

const isBoolean = (val: any) => typeof val === "boolean";

const cloneDeep = (obj: any) => {
  var _out = new obj.constructor();

  var getType = function (n: any) {
    return Object.prototype.toString.call(n).slice(8, -1);
  };

  for (var _key in obj) {
    if (obj.hasOwnProperty(_key)) {
      _out[_key] =
        getType(obj[_key]) === "Object" || getType(obj[_key]) === "Array"
          ? cloneDeep(obj[_key])
          : obj[_key];
    }
  }
  return _out;
};

export const containerInitialState: ContainerType = {
  propertyFilters: {},
  navigationPropertyFilters: {},
  functionFilters: [],
  saveToLocalStorage: false,
  globalStyleSchema: null,
};

const removeKey = (key: any, { [key]: _, ...rest }) => rest;

const isStringOrNumber = (val: any) => {
  if (typeof val === "string") return !!val;
  if (typeof val === "number" && !isNaN(val)) return true;
  return false;
};

const isNonEmptyArray = (val: any) => Array.isArray(val) && val.length > 0;

export const containerReducer = (
  state = containerInitialState,
  action: any
) => {
  switch (action.type) {
    case FILTER_UPDATE_FILTER: {
      const {
        fieldName,
        fieldValue,
        operator,
        multipleValuesLogicOperator,
        allowNullValue,
      } = action;

      if (isStringOrNumber(fieldValue) || isNonEmptyArray(fieldValue)) {
        const type =
          isNonEmptyArray(fieldValue) &&
          fieldValue.some((v: any) => v && v instanceof Date)
            ? "datetime"
            : "";
        return {
          ...state,
          propertyFilters: {
            ...state.propertyFilters,
            [fieldName]: {
              value: fieldValue,
              operator,
              multipleValuesLogicOperator,
              type,
            },
          },
        };
      }

      // if the value is null, it should be removed from filters.
      if (fieldValue !== null && typeof fieldValue === "boolean") {
        return {
          ...state,
          propertyFilters: {
            ...state.propertyFilters,
            [fieldName]: {
              value: fieldValue,
              operator,
              multipleValuesLogicOperator,
              type: "boolean",
            },
          },
        };
      }

      // Potential Datetime field checking
      if (
        typeof fieldValue === "object" &&
        fieldValue !== null &&
        !Array.isArray(fieldValue)
      )
        // TODO: maybe to try with instaceof DateTime
        return {
          ...state,
          propertyFilters: {
            ...state.propertyFilters,
            [fieldName]: {
              value: fieldValue,
              operator,
              multipleValuesLogicOperator,
              type: "datetime",
            },
          },
        };

      if (allowNullValue) {
        return {
          ...state,
          propertyFilters: {
            ...state.propertyFilters,
            [fieldName]: {
              value: fieldValue,
              operator,
              multipleValuesLogicOperator,
              type: "",
            },
          },
        };
      }

      // There is no value => remove it from storage
      return {
        ...state,
        propertyFilters: {
          ...removeKey(fieldName, state.propertyFilters),
        },
      };
    }
    case FILTER_UPDATE_NAVIGATION_PROPERTY_FILTER: {
      const {
        navigationPropertyName,
        fieldName,
        fieldValue,
        customExpression,
        navigationNameIsNested,
      } = action;
      const haveValue =
        isNonEmptyArray(fieldValue) ||
        isStringOrNumber(fieldValue) ||
        isBoolean(fieldValue);

      if (haveValue) {
        return {
          ...state,
          navigationPropertyFilters: {
            ...state.navigationPropertyFilters,
            [fieldName]: {
              value: fieldValue,
              navigationPropertyName,
              customExpression,
              navigationNameIsNested,
              type: isBoolean(fieldValue) ? "boolean" : "",
            },
          },
        };
      }
      return {
        ...state,
        navigationPropertyFilters: {
          ...removeKey(fieldName, state.navigationPropertyFilters),
        },
      };
    }
    case FILTER_UPDATE_FUNCTION_FILTER: {
      const { filterName, functionFilterQueryString, values } = action;
      if (functionFilterQueryString) {
        const existing = state.functionFilters.some(
          (f) => f.filterName === filterName
        );
        if (existing)
          return {
            ...state,
            functionFilters: state.functionFilters.map((f) =>
              f.filterName === filterName
                ? { ...f, queryString: functionFilterQueryString, values }
                : f
            ),
          };
        return {
          ...state,
          functionFilters: [
            ...state.functionFilters,
            { filterName, queryString: functionFilterQueryString, values },
          ],
        };
      }

      return {
        ...state,
        functionFilters: state.functionFilters.filter(
          (f) => f.filterName !== filterName
        ),
      };
    }
    case FILTER_UPDATE_MULTIPLE_FUNCTION_FILTERS: {
      const { filtersToUpdate } = action;
      let updatedState = cloneDeep(state);

      filtersToUpdate.forEach((filter: any) => {
        const { filterName, functionFilterQueryString, values } = filter;
        if (functionFilterQueryString) {
          const existing = state.functionFilters.some(
            (f) => f.filterName === filterName
          );
          if (existing)
            updatedState = {
              ...updatedState,
              functionFilters: state.functionFilters.map((f) =>
                f.filterName === filterName
                  ? { ...f, queryString: functionFilterQueryString, values }
                  : f
              ),
            };
          else
            updatedState = {
              ...updatedState,
              functionFilters: [
                ...state.functionFilters,
                { filterName, queryString: functionFilterQueryString, values },
              ],
            };
        } else
          updatedState = {
            ...updatedState,
            functionFilters: state.functionFilters.filter(
              (f) => f.filterName !== filterName
            ),
          };
      });

      return updatedState;
    }
    case FILTER_RESET_ALL_FILTERS:
      {
        const { keepTreeViewFilter } = action;
        // TODO: this should be refactored, filter reducer should know nothing about data that is coming in
        if (keepTreeViewFilter)
          return {
            functionFilters: state.functionFilters.filter(
              (f) => f.filterName === "TreeViewID"
            ),
            navigationPropertyFilters: state.navigationPropertyFilters
              .TreeViewID
              ? {
                  TreeViewID: state.navigationPropertyFilters.TreeViewID,
                }
              : {},
            propertyFilters: state.propertyFilters.TreeViewID
              ? {
                  TreeViewID: state.propertyFilters.TreeViewID,
                }
              : {},
          };
      }
      return containerInitialState;
    case FILTER_RESET_POPERTY_FILTERS: {
      const { filterNames } = action;

      if (Array.isArray(filterNames) && filterNames.length) {
        let modifiedPropertyFiltetrs = cloneDeep(state.propertyFilters);

        filterNames.forEach((filter) => {
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

      return state;
    }
    case FILTER_OVERRIDE_FILTER_STATE: {
      const { filterState } = action;
      const navigationPropertyFilters =
        filterState?.navigationPropertyFilters ||
        containerInitialState.navigationPropertyFilters;
      const functionFilters =
        filterState?.functionFilters || containerInitialState.functionFilters;

      if (state.navigationPropertyFilters.TreeViewID)
        navigationPropertyFilters.TreeViewID =
          state.navigationPropertyFilters.TreeViewID;
      if (state.functionFilters.some((f: any) => f.filterName === "TreeViewID"))
        functionFilters.push(
          state.functionFilters.find((f) => f.filterName === "TreeViewID")
        );

      return {
        propertyFilters:
          filterState?.propertyFilters || containerInitialState.propertyFilters,
        navigationPropertyFilters,
        functionFilters,
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
  static convertToKendoGridFilter = (
    filters: any,
    functionFilters = null,
    navigationPropertyFilters = null
  ) => {
    const filterObject: any = {
      skip: 0,
      filter: {
        logic: "and",
        filters: [],
      },
      functionFilterQueryString:
        FilterHelperMethods.getFunctionFiltersQueryString(functionFilters),
      navigationPropertyFilterQueryString:
        FilterHelperMethods.getNavigationPropFiltersQueryString(
          navigationPropertyFilters
        ),
    };

    Object.keys(filters).forEach((k) => {
      const filterValue = filters[k].value;
      const operator = filters[k].operator || "eq";
      const filterType = filters[k].type;
      const logic = filters[k].multipleValuesLogicOperator || "or";

      if (
        !Array.isArray(filterValue) &&
        (filterValue instanceof Date || filterType === "datetime")
      ) {
        const value =
          typeof filterValue === "string" ? new Date(filterValue) : filterValue; // Need this check because when parsing stringified object from local storage then Datetime object becomes string so we need to convert it back to Date object
        filterObject.filter.filters.push({
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
          filterObject.filter.filters.push(multiFilter);

          k.split(";").forEach((field) => {
            multiFilter.filters.push({
              field,
              value: filterValue,
              operator,
            });
          });
        } else
          filterObject.filter.filters.push({
            field: k,
            value: filterValue,
            operator,
            key: k,
          });
      } else if (Array.isArray(filterValue) && filterValue.length > 0) {
        filterObject.filter.filters.push({
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
          const index = filterObject.filter.filters.findIndex(
            (f: any) => f.key === k
          );

          if (index >= 0) {
            let filterToAssign = {
              field: k,
              value: proccessedValue,
              operator: filterOperator,
            };
            if (v.value) filterToAssign = { ...filterToAssign, ...v };
            filterObject.filter.filters[index].filters.push(filterToAssign);
          }
        });
      }
    });

    return filterObject;
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
          (gf: any) =>
            gf.navigationPropertyName === filter.navigationPropertyName
        )
      ) {
        groupedFilters = groupedFilters.map((gf: any) => {
          if (gf.navigationPropertyName === filter.navigationPropertyName) {
            return {
              navigationPropertyName: filter.navigationPropertyName,
              values: filter.customExpression
                ? gf.values
                : [...gf.values, { field: f, value: filter.value }],
              customExpressions: filter.customExpression
                ? [...gf.customExpressions, filter.customExpression]
                : gf.customExpressions,
              navigationNameIsNested: filter.navigationNameIsNested,
            };
          }
          return gf;
        });
      } else {
        groupedFilters.push({
          navigationPropertyName: filter.navigationPropertyName,
          values: filter.customExpression
            ? []
            : [{ field: f, value: filter.value }],
          customExpressions: filter.customExpression
            ? [filter.customExpression]
            : [],
          navigationNameIsNested: filter.navigationNameIsNested,
        });
      }
    });

    if (groupedFilters.length > 0) {
      groupedFilters.forEach((f: any, ind: number) => {
        const multipleLevelNavigationProperty =
          f.navigationPropertyName.indexOf("/") >= 0 &&
          f.navigationNameIsNested;

        const splittedName = f.navigationPropertyName.split("/");
        const navPropName = multipleLevelNavigationProperty
          ? splittedName.slice(0, splittedName.length - 1).join("/")
          : f.navigationPropertyName;
        const subNavPropName = multipleLevelNavigationProperty
          ? splittedName[splittedName.length - 1]
          : null;

        // Here we can see one limitation of this helper method => we are forced to use 's' as input parameter in lambda expression when populating filters
        // We can add mechanism to support any other letter but since the scope of this method is not big(only few of us devs are using this), then we should not add additional complexity just for that purpose
        if (multipleLevelNavigationProperty)
          query += `${navPropName}/any(x: x/${subNavPropName}/any(s: {expressionPart}))`;
        else query += `${navPropName}/any(s: {expressionPart})`;
        let expressionPart = "";

        if (f.customExpressions && f.customExpressions.length > 0) {
          f.customExpressions.forEach((ce: any, i: number) => {
            if (i === f.customExpressions.length - 1)
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
}
