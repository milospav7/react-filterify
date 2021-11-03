import { createStore, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { configureFilterfyReducer } from "./orchestratorReducer";

const composedEnhancers = composeWithDevTools();
const filterifyFilters = configureFilterfyReducer([
  {
    id: "F1",
    saveToLocalStorage: true,
    styleSchema: {
      highlightWhenInUse: true,
      labelColor: "red",
      labelFontSize: "13px",
      placeholderColor: "green",
    },
  },
  "F2",
]);

const reducers = combineReducers({
  filterifyFilters,
});

const store = createStore(reducers, composedEnhancers);

export default store;
