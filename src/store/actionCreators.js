import {
  OVERRIDE_STATE,
  RESET_ALL_FILTERS,
  RESET_POPERTY_FILTERS,
  UPDATE_FILTER,
  UPDATE_FUNCTION_FILTER,
  UPDATE_MULTIPLE_FUNCTION_FILTERS,
  UPDATE_NAVIGATION_PROPERTY_FILTER,
} from "./actionTypes";

/**
 * Updates propertyFilters map inside filter instance
 * @param {*} id redux filter Id - must be initialized inside gridFilters.js reducer
 * @param {*} filteringProperty name of the property/field used for filtering. If contains ';' char then it will be processed as multi filter - filtering more than one field with one common filter(value). Example: 'Width;Height'
 * @param {*} filteringValue value used for filtering - both number/string and array of number/string are supported
 * @param {*} operator operator used for field filtering - contains, eq, neq etc..
 * @param {*} logic operator used as logic operator between multiple values..
 */
export const updatePropertyFilter = (
  id,
  filteringProperty,
  filteringValue,
  operator = "eq",
  logic = "or",
  allowNullValue = false
) => ({
  type: UPDATE_FILTER,
  id,
  filteringProperty,
  filteringValue,
  operator,
  logic,
  allowNullValue,
});

/**
 * Resets all in filter instance, reverts to initial state
 * @param {*} id redux filter Id - must be initialized inside gridFilters.js reducer
 */
export const resetAllFilters = (id, keepTreeViewFilter = false) => ({
  type: RESET_ALL_FILTERS,
  id,
  keepTreeViewFilter,
});

/**
 * Resets all in filter instance, reverts to initial state
 * @param {*} id redux filter Id - must be initialized inside gridFilters.js reducer
 * @param {*} filteringProperties collections of filter names that should be reseted
 */
export const resetPropertyFiltersByNames = (id, filteringProperties) => ({
  type: RESET_POPERTY_FILTERS,
  id,
  filteringProperties,
});

/**
 *	Updates navigationPropetyFilters map inside filter instance
 * @param {*} id redux filter Id - must be initialized inside gridFilters.js reducer
 * @param {*} navigationProperty name of collection based property that we want to filter with lambda expression
 * @param {*} filteringProperty name of the property/field of navigation entity, used for filtering inside lambda expression
 * @param {*} filteringValue value used for filtering - both number/string and array of number/string are supported
 * @param {*} generatedExpression use only when you want to pass functions inside lambda expression(when filteringValue argument is not good enough) - for example if we want to include 'inCachedView(s/SubstationID, 21fdb7bb-39db-435d-af9a-60d695303ad1, true)' in navigation property lambda, then we need to pass this 'inCachedView(s/SubstationID, 21fdb7bb-39db-435d-af9a-60d695303ad1, true)' using generatedExpression argument
 * @param {*} navigationPropertyIsNested indicates whether provided navigation property name represents nav property inside nav property(important when constructing query string, because if it is nested it means that two lambdas will be created for this filter - one inside another). Example: navigationProperty: 'Users/Books', this is nested and will generate smth like '...Users/any(u: Books/any(b: andHereComesgeneratedExpressionOrfilteringValuesWithOperators))..' At the moment we support maximum of 2 level nesting.
 * @example1 updateNavigationPropertyFilter(12, 'RelatedSubstations', 'OperationalRegion', 'OpZone 1', null) - for final filter result(after using gridFilter reducer helper methods): RelatedSubstations/any(s: ( s
 * @example2 updateNavigationPropertyFilter(12, 'RelatedSubstations', 'OperationalRegion', '21fdb7bb-39db-435d-af9a-60d695303ad1', 'inCachedView(s/SubstationID, 21fdb7bb-39db-435d-af9a-60d695303ad1, true)') for final filter result(after using gridFilter reducer helper methods): RelatedSubstations/any(s: inCachedView(s/SubstationID, 21fdb7bb-39db-435d-af9a-60d695303ad , true)), /OperationalRegion eq 'OpZone 1')
 * @note There is one limitation when using generatedExpression argument. If you need lambda input parameter inside passed expression, use 's' for lambda input-paramter, example: 'isNotEmpty(s.Name)',
 */
export const updateNavigationPropertyFilter = (
  id,
  navigationProperty,
  filteringProperty,
  filteringValue,
  generatedExpression = null,
  navigationPropertyIsNested = false
) => ({
  type: UPDATE_NAVIGATION_PROPERTY_FILTER,
  id,
  navigationProperty,
  filteringProperty,
  filteringValue,
  generatedExpression,
  navigationPropertyIsNested,
});

/**
 * Updates functionFilters array inside filter instance
 * @param {*} id redux filter Id - must be initialized inside gridFilters.js reducer
 * @param {*} filteringProperty unique identifier of function filter string. Should be field name
 * @param {*} filterQueryString function filter that needs to be included in query string - non standard functions
 * @param {*} values this can be used as a container for values that are provided inside function query string, as a separete object for putting raw values only. Format/structure is not strict, and should be constrained only by the way of retreiving these values back in caller component - for example when we need to read these values on component mount we can use this object from redux(because we can't read them from raw query string)
 * @example filterQueryString: 'insideTimeFrame(PlannedStartTime, PlannedEndTime, 2020-06-30T22:00:00.000Z, null, false, false)'
 */
export const updateFunctionFilter = (
  id,
  filteringProperty,
  filterQueryString,
  values = null
) => ({
  type: UPDATE_FUNCTION_FILTER,
  id,
  filteringProperty,
  filterQueryString,
  values,
});

export const updateMultipleFunctionFilters = (id, filtersToUpdate) => ({
  type: UPDATE_MULTIPLE_FUNCTION_FILTERS,
  id,
  filtersToUpdate,
});

export const overrideFilterState = (id, filterState) => ({
  type: OVERRIDE_STATE,
  id,
  filterState,
});
