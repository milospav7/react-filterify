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