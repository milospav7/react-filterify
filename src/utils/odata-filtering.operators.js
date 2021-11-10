import { isCompositeFilterDescriptor } from './filtering/filter-descriptor.interface';
import { compose, ifElse } from './funcs';
import { normalizeField, quote, toLower, isDateValue, isStringValue, serializeFilters, encodeValue, toUTC } from './filter-serialization.common';
import { normalizeFilters } from './filtering/filter.operators';

function arrayize(value) {
	if (value == null) return [];
	return Array.isArray(value) ? value : [value];
}

function isGuid(value) {    
    var regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/i;
    var match = regex.exec(value);
    return match != null;
}

const formatDate = ({ utcDates }) => ({ field, value, ignoreCase, operator }) => ({
    value: JSON.stringify(!utcDates ? toUTC(value) : value).replace(/"/g, ""),
    field,
    ignoreCase,
    operator
});
const fnFormatter = ({ operator }) => ({ field, value }) => `${operator}(${field},${value})`;
const singleOperatorFormatter = ({ operator }) => {
    if (operator === "inMulti") return ({ field, value }) => `${value} in ${field}`;
    if (operator === "in") return ({ field, value }) => `${field} in (${arrayize(value).map(t => isGuid(t) ? t : `'${t}'`).join(",")})`
    if (operator === "notin") return ({ field, value }) => `not(${field} in (${arrayize(value).map(t => isGuid(t) ? t : `'${t}'`).join(",")}))`
    return ({ field, value }) => `${field} ${operator} ${value}`
}
const stringFormat = formatter => compose(formatter, encodeValue, quote, toLower, normalizeField);
const stringFnOperator = settings => stringFormat(fnFormatter(settings));
const stringOperator = settings => stringFormat(singleOperatorFormatter(settings));
const numericOperator = settings => compose(singleOperatorFormatter(settings), normalizeField);
const dateOperator = settings => compose(singleOperatorFormatter(settings), normalizeField, formatDate(settings));
const ifDate = settings => ifElse(isDateValue, dateOperator(settings), numericOperator(settings));
const typedOperator = settings => ifElse(isStringValue, stringOperator(settings), ifDate(settings));
// const appendEqual = str => `${str} eq -1`;
const nonValueExpression = formatter => compose(formatter, normalizeField);
const filterOperators = (operator, settings) => ({
    contains: stringFnOperator(Object.assign({}, settings, { operator: "contains" })),
    // doesnotcontain: compose(appendEqual, stringFnOperator(Object.assign({}, settings, { operator: "indexof" }))), // oms service does not support indexOf, instead we should use not contains
    doesnotcontain: stringFnOperator(Object.assign({}, settings, { operator: "not contains" })),
    endswith: stringFnOperator(Object.assign({}, settings, { operator: "endswith" })),
    eq: typedOperator(Object.assign({}, settings, { operator: "eq" })),
    inMulti: typedOperator(Object.assign({}, settings, { operator: "inMulti" })),   // IPS Custom, when filtering multivalue field
    in: typedOperator(Object.assign({}, settings, { operator: "in" })),   // IPS Custom
    notin: typedOperator(Object.assign({}, settings, { operator: "notin" })),   // IPS Custom
    gt: typedOperator(Object.assign({}, settings, { operator: "gt" })),
    gte: typedOperator(Object.assign({}, settings, { operator: "ge" })),
    isempty: nonValueExpression(({ field }) => `${field} eq ''`),
    isnotempty: nonValueExpression(({ field }) => `${field} ne ''`),
    isnotnull: nonValueExpression(({ field }) => `${field} ne null`),
    isnull: nonValueExpression(({ field }) => `${field} eq null`),
    lt: typedOperator(Object.assign({}, settings, { operator: "lt" })),
    lte: typedOperator(Object.assign({}, settings, { operator: "le" })),
    neq: typedOperator(Object.assign({}, settings, { operator: "ne" })),
    startswith: stringFnOperator(Object.assign({}, settings, { operator: "startswith" }))
}[operator]);
const join = x => ` ${x.logic} `;
const serialize = settings => x => filterOperators(x.operator, settings)(x);
const serializeAll = settings => serializeFilters(filter => ifElse(isCompositeFilterDescriptor, serializeAll(settings), serialize(settings))(filter), join);

export const serializeFilter = (filter, settings = {}) => {
    if (filter.filters && filter.filters.length) {
        return "$filter=" + serializeAll(settings)(normalizeFilters(filter));
    }
    return "";
};
