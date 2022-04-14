import { containerInitialState, containerReducer } from "./containerReducer";
import { Container, FilterConfiguration, ValueTypedObject } from "./types";

let CONTAINERS: ValueTypedObject<Container> = {};

const getStorageKey = (containerId: string) =>
  `${containerId}_filterify_container`; // HERE WE CAN MODIFY SELECTOR KEY

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

const containers = (state = CONTAINERS, action: any) => {
  if (!action.id) return state;

  const container = state[action.id];
  const updatedFiltersContainer = containerReducer(container, action);

  const enrichedFilterState = {
    ...updatedFiltersContainer,
    dateTimeUpdated: new Date().toString(), // Enrich for datetime stamp
  };
  if (shouldSaveInStorage(action.id)) {
    const key = getStorageKey(action.id);
    localStorage.setItem(key, JSON.stringify(enrichedFilterState));
  }

  return {
    ...state,
    [action.id]: enrichedFilterState,
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
