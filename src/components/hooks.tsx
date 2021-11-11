/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateNavigationPropertyFilter,
  updatePropertyFilter,
} from "../store/actionCreators";
import { FilteringEventHandlersType, FilterOperatorType } from "../store/types";

export const useFilterifyFilter = (containerId: string) => ({
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
  styleSchema: useSelector(
    (state: any) => state.filterifyFilters[containerId]?.styleSchema
  ),
  dateTimeUpdated: useSelector(
    (state: any) => state.filterifyFilters[containerId]?.dateTimeUpdated
  ),
});

export const useFilterCounter = (containerId: string) => {
  let counter = 0;

  const propertyFilters = useSelector(
    (state: any) => state.filterifyFilters[containerId].propertyFilters ?? {}
  );
  const navigationPropertyFilters = useSelector(
    (state: any) =>
      state.filterifyFilters[containerId].navigationPropertyFilters ?? {}
  );
  const functionFilters = useSelector(
    (state: any) => state.filterifyFilters[containerId].functionFilters ?? []
  );

  if (containerId) {
    counter += Object.keys(propertyFilters).length;
    counter += Object.keys(navigationPropertyFilters).length;
    counter += functionFilters.length;

    return counter;
  }
  return null;
};

export const useFilterSubscription = (
  containerId: string,
  eventHandlers: FilteringEventHandlersType,
  raiseEventOnMount = false
) => {
  const { onChange } = eventHandlers;

  const firstRenderRef = useRef(true);
  const { current: isFirstRender } = firstRenderRef;

  const {
    propertyFilters,
    navigationPropertyFilters,
    functionFilters,
    dateTimeUpdated: dateTimeFilterUpdated,
  } = useFilterifyFilter(containerId);

  useEffect(() => {
    if (raiseEventOnMount)
      onChange({ propertyFilters, navigationPropertyFilters, functionFilters });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isFirstRender)
      onChange({ propertyFilters, navigationPropertyFilters, functionFilters });
    firstRenderRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateTimeFilterUpdated]);
};

export const useContainerActions = (
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

export const useContainerState = (
  containerId: string,
  filteringProperty: string,
  navigationProperty?: string
) => {
  const { propertyFilters, navigationPropertyFilters } =
    useFilterifyFilter(containerId);
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
