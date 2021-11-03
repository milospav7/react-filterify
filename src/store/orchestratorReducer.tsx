import { containerInitialState, containerReducer } from "./containerReducer";
import {
  ContainerType,
  FilterConfigurationType,
  ValueTypedObject,
} from "./types";

let PREBUILT_CONTAINERS: ValueTypedObject<ContainerType>;

const getStorageKey = (containerId: string) =>
  `${containerId}_filterify_container`; // HERE WE CAN MODIFY SELECTOR KEY

const tryGetInitStateFromStorage = (containerId: string) => {
  try {
    const fromLocalStorage = localStorage.getItem(getStorageKey(containerId));
    if (fromLocalStorage) return JSON.parse(fromLocalStorage);
    return { ...containerInitialState };
  } catch (_error) {
    return { ...containerInitialState }; // fallback if somehow parsing fails
  }
};

const shouldSaveInStorage = (id: string) =>
  PREBUILT_CONTAINERS && PREBUILT_CONTAINERS[id]?.saveToLocalStorage;

const filterifyFilters = (state = PREBUILT_CONTAINERS, action: any) => {
  if (!action.id) return state;

  const container = state[action.id];
  const updatedFiltersContainer = containerReducer(container, action);

  const enrichedFilterState = {
    ...updatedFiltersContainer,
    dateTimeUpdated: new Date().toString(), // Enrich for datetime stamp
  };
  if (shouldSaveInStorage(action.id))
    localStorage.setItem(
      getStorageKey(action.id),
      JSON.stringify(enrichedFilterState)
    );

  return {
    ...state,
    [action.id]: enrichedFilterState,
  };
};

export const configureFilterfyReducer = (
  preconfigurations: string[] | FilterConfigurationType[]
) => {
  if (!preconfigurations || preconfigurations.length === 0)
    throw new Error(
      "Filteirfy reducer configurator function 'configureFilterfyReducer' must recive at least one filter configuration."
    );

  PREBUILT_CONTAINERS = {};

  preconfigurations.forEach((config: FilterConfigurationType) => {
    if (typeof config === "string") {
      PREBUILT_CONTAINERS[config] = { ...containerInitialState };
    } else {
      let initialState = config.saveToLocalStorage
        ? tryGetInitStateFromStorage(config.id)
        : { ...containerInitialState };

      PREBUILT_CONTAINERS[config.id] = {
        ...initialState,
        saveToLocalStorage: config.saveToLocalStorage,
        styleSchema: config.styleSchema,
      };
    }
  });

  return filterifyFilters;
};
