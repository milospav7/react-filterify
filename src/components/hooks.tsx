/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetAllFilters,
  updateNavigationPropertyFilter,
  updatePropertyFilter,
} from "../store/actionCreators";
import { FilterHelperMethods } from "../store/containerReducer";
import { FilteringEventHandlersType, FilterOperatorType } from "../store/types";

export const useContainerState = (containerId: string) => ({
  propertyFilters: useSelector(
    (state: any) => state.filterifyFilters[containerId]?.propertyFilters
  ),
  navigationPropertyFilters: useSelector(
    (state: any) =>
      state.filterifyFilters[containerId]?.navigationPropertyFilters
  ),
  functionFilters: useSelector(
    (state: any) => state.filterifyFilters[containerId]?.functionFilters
  ),
  dateTimeUpdated: useSelector(
    (state: any) => state.filterifyFilters[containerId]?.dateTimeUpdated
  ),
});

export const useActiveFiltersCounter = (containerId: string) => {
  let counter = 0;

  const { propertyFilters, navigationPropertyFilters, functionFilters } =
    useContainerState(containerId);

  if (propertyFilters) counter += Object.keys(propertyFilters).length;
  if (navigationPropertyFilters)
    counter += Object.keys(navigationPropertyFilters).length;
  if (functionFilters) counter += functionFilters.length;

  return counter;
};

export const useContainerStyleSchema = (containerId: string) =>
  useSelector((state: any) => state.filterifyFilters[containerId].styleSchema);

export const useContainerSubscription = (
  containerId: string,
  eventHandlers: FilteringEventHandlersType,
  raiseEventOnMount = false
) => {
  const { onChange } = eventHandlers;
  const filterString = useODataFilterQuery(containerId);
  const firstRenderRef = useRef(true);
  const { current: isFirstRender } = firstRenderRef;

  const {
    propertyFilters,
    navigationPropertyFilters,
    functionFilters,
    dateTimeUpdated: dateTimeFilterUpdated,
  } = useContainerState(containerId);

  useEffect(() => {
    if (raiseEventOnMount)
      onChange(
        { propertyFilters, navigationPropertyFilters, functionFilters },
        { oDataFilterString: filterString }
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isFirstRender)
      onChange(
        { propertyFilters, navigationPropertyFilters, functionFilters },
        { oDataFilterString: filterString }
      );
    firstRenderRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateTimeFilterUpdated]);
};

export const useFilterActions = (
  containerId: string,
  filteringProperty: string,
  navigationProperty?: string
) => {
  const dispatcher = useDispatch();

  const updateFilter = useCallback(
    (
      filterValue: any,
      symbols?: FilterOperatorType,
      customExpression?: string
    ) => {
      if (navigationProperty) {
        dispatcher(
          updateNavigationPropertyFilter(
            containerId,
            navigationProperty,
            filteringProperty,
            filterValue,
            customExpression
          )
        );
      } else
        dispatcher(
          updatePropertyFilter(
            containerId,
            filteringProperty,
            filterValue,
            symbols?.operator,
            symbols?.logic
          )
        );
    },
    [containerId, dispatcher, filteringProperty, navigationProperty]
  );

  return { updateFilter };
};

export const useContainerActions = (containerId: string) => {
  const dispatcher = useDispatch();

  const removeAllFilters = useCallback(() => {
    dispatcher(resetAllFilters(containerId));
  }, [dispatcher, containerId]);

  return { removeAllFilters };
};

export const useFilterState = (
  containerId: string,
  filteringProperty: string,
  navigationProperty?: string
) => {
  const { propertyFilters, navigationPropertyFilters } =
    useContainerState(containerId);
  const filterOperator = propertyFilters[filteringProperty]?.operator;

  const filterValue = useMemo(() => {
    if (navigationProperty)
      return navigationPropertyFilters[filteringProperty]?.value ?? null;
    return propertyFilters[filteringProperty]?.value ?? null;
  }, [
    navigationPropertyFilters[filteringProperty]?.value,
    propertyFilters[filteringProperty]?.value,
  ]);

  return { filterValue, filterOperator };
};

export const useODataFilterQuery = (containerId: string) => {
  const {
    propertyFilters,
    navigationPropertyFilters,
    functionFilters,
    dateTimeUpdated,
  } = useContainerState(containerId);

  const filterQueryString = useMemo(
    () =>
      FilterHelperMethods.generateODataFilterString({
        propertyFilters,
        navigationPropertyFilters,
        functionFilters,
      }),
    [dateTimeUpdated]
  );

  return filterQueryString;
};
