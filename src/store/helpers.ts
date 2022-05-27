import { containerInitialState } from "./containerReducer";
import { Container, ContainerConfiguration } from "./types";

export const isBoolean = (val: any) => typeof val === "boolean";

export const cloneDeep = (obj: any) => {
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

export const removeKey = (key: any, { [key]: _, ...rest }) => rest;

export const isStringOrNumber = (val: any) => {
  if (typeof val === "string") return !!val;
  if (typeof val === "number" && !isNaN(val)) return true;
  return false;
};

export const isNonEmptyArray = (val: any) =>
  Array.isArray(val) && val.length > 0;

export const valueShouldBeRemoved = (val: any) => {
  if (val === null || val === undefined) return true;
  if (typeof val === "string") return !val.trim();
  if (
    typeof val === "number" ||
    typeof val === "boolean" ||
    typeof val === "object"
  )
    return false;
  return true;
};

export const concatFilterQuerySubstrings = (...args: any) => {
  let concated = "";
  if (Array.isArray(args) && args.length > 0) {
    const filtered = args.filter((a) => a);
    filtered.forEach((s, i) => {
      if (s) {
        if (i === filtered.length - 1) concated += ` ${s}`;
        else concated += ` ${s} and`;
      }
    });
  }
  return concated;
};

export const getStorageKey = (containerId: string) => `RF_CONTAINER_${containerId}`; // HERE WE CAN MODIFY SELECTOR KEY

export const tryGetInitStateFromStorage = (
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

export const includeFilterSubstring = (
  queryString: any,
  substring: any,
  operator = "and"
) => {
  const targetQueryPart = "$filter=";
  const containsFilters = queryString.indexOf(targetQueryPart) >= 0;
  const index = queryString.indexOf(targetQueryPart) + targetQueryPart.length;

  const filterSubstring = containsFilters
    ? queryString.substring(index, queryString.length)
    : queryString;

  const opr = filterSubstring.startsWith("$") ? "&" : operator;
  const remaining =
    queryString.indexOf(targetQueryPart) > 0
      ? queryString.substring(0, queryString.indexOf(targetQueryPart))
      : "";

  return `${remaining}$filter=${substring} ${opr} ${filterSubstring}`;
};

export const resolveInitialState = (config: ContainerConfiguration) => {
  if (config.saveToLocalStorage)
    return tryGetInitStateFromStorage(config.id, containerInitialState);
  return containerInitialState;
};
