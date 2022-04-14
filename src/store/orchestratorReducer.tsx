import { containerInitialState, containerReducer } from "./containerReducer_rt";
import { Container, FilterConfiguration, ValueTypedObject } from "./types";

let CONTAINERS: ValueTypedObject<Container> = {};

const getStorageKey = (containerId: string) => `RF_CONTAINER_${containerId}`; // HERE WE CAN MODIFY SELECTOR KEY

const tryGetInitStateFromStorage = (
  containerId: string,
  defaultState: Container
) => {
  try {
    const key = getStorageKey(containerId);
    const fromLocalStorage = localStorage.getItem(key);

    if (fromLocalStorage) return JSON.parse(fromLocalStorage);
    return defaultState;
  } catch (_error) {
    return defaultState; // fallback if somehow parsing fails
  }
};

const shouldSaveInStorage = (id: string) => CONTAINERS[id]?.saveToLocalStorage;

// TODO: sync with rt types
const containers = (state = CONTAINERS, action: any) => {
  const containerId = action.payload?.containerId;
  if (!containerId) return state;

  const container = state[containerId];
  const updatedFiltersContainer = containerReducer(container, action);

  const enrichedFilterState = {
    ...updatedFiltersContainer,
    dateTimeUpdated: new Date().toString(), // Enrich for datetime stamp
  };
  if (shouldSaveInStorage(containerId)) {
    const key = getStorageKey(containerId);
    localStorage.setItem(key, JSON.stringify(enrichedFilterState));
  }

  return {
    ...state,
    [containerId]: enrichedFilterState,
  };
};

export const configureFilterfyReducer = (
  preconfigurations: FilterConfiguration[]
) => {
  if (preconfigurations.length === 0)
    throw new Error(
      "Filterify reducer configurator function 'configureFilterfyReducer' must receive at least one container configuration."
    );

  preconfigurations.forEach((config: FilterConfiguration) => {
    let initialState = config.saveToLocalStorage
      ? tryGetInitStateFromStorage(config.id, containerInitialState)
      : containerInitialState;

    CONTAINERS[config.id] = {
      ...initialState,
      saveToLocalStorage: config.saveToLocalStorage,
      styleSchema: config.styleSchema,
    };
  });

  return containers;
};
