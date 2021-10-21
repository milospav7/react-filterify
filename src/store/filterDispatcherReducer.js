import { gridFilter } from "./filterReducer";

// const getStorageKey = (filterId) => `${filterId}_grid_filters_state`; // HERE WE CAN MODIFY SELECTOR KEY

// const tryGetInitStateFromStorage = (filterId) => {
// 	if (filterId) {
// 		try {
// 			const fromLocalStorage = localStorage.getItem(getStorageKey(filterId));
// 			if (fromLocalStorage) return JSON.parse(fromLocalStorage);
// 			return { ...singleFilterInitialState };
// 		} catch (error) {
// 			Exceptions.logException(error);
// 			return { ...singleFilterInitialState }; // fallback if somehow parsing fails
// 		}
// 	}
// 	return null;
// };

// /* eslint-disable import/prefer-default-export */
// export const reduxFilterIDs = {

// };

// const shouldSaveInStorage = (id) =>
// 	![
// 		
// 	].includes(id); // These modal instances do not need to be set in local storage

// const filters = {
// 	[reduxFilterIDs.XYZ_NOLOCALSTORAGE]: { ...singleFilterInitialState }, // Local storage is unnecessary for this instance

// 	[reduxFilterIDs.ABC_WITHLOCALSTORAGE]: tryGetInitStateFromStorage(
// 		reduxFilterIDs.ABC_WITHLOCALSTORAGE
// 	),
// };

// export const gridFilters = (state = filters, action) => {
export const gridFilters = (state, action) => {
  // if (!(action.id in filters)) return state; // TODO: update to resolve dynamically

  const filter = state[action.id];
  const updatedFilter = gridFilter(filter, action);
  const enrichedFilterState = {
    ...updatedFilter,
    dateTimeUpdated: new Date().toString(),
  };
  // if (shouldSaveInStorage(action.id))
  // 	localStorage.setItem(getStorageKey(action.id), JSON.stringify(enrichedFilterState));

  return {
    ...state,
    [action.id]: enrichedFilterState,
  };
};
