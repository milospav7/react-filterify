import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { configureFilterfyReducer } from "./orchestratorReducer";

const composedEnhancers = composeWithDevTools();

const store = createStore(
  configureFilterfyReducer(["F1", "F2"]),
  composedEnhancers
);

export default store;
