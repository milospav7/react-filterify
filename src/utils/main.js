export { isCompositeFilterDescriptor } from './filtering/filter-descriptor.interface';
export { toODataString } from './odata.operators';
export { toDataSourceRequestString, toDataSourceRequest } from './mvc/operators';
export { translateDataSourceResultGroups, translateAggregateResults } from './mvc/deserialization';
export { orderBy, process, distinct } from './array.operators';
export { getter } from './accessor';
export { filterBy, compileFilter } from './filtering/filter-expression.factory';
export { groupBy } from './grouping/group.operators';
export { composeSortDescriptors } from './sorting/sort-array.operator';
export { normalizeFilters } from './filtering/filter.operators';
export { normalizeGroups } from './grouping/group.operators';
export { aggregateBy } from './grouping/aggregate.operators';
