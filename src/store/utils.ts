import { serializeFilter } from "../utils/odata-filtering.operators";
import { concatFilterQuerySubstrings, isBoolean } from "./helpers";

export class ContainerHelperMethods {
  /**
   * Method will use propertyFilters, navigationPropertyFilters and functionFilters(objects and array from filter instance) to generate kendo filter object that GenericDataGrid can use when calling getMethod, in order to filter data
   * @param {Object} filters propertyFilters map - part of filter instance state
   * @param {Object[]} functionFilters functionFilters array - part of filter instance state
   * @param {Object} navigationPropertyFilters navigationPropertyFilters map - part of filter instance state
   */
  static getFilterStrings = (
    filters: any,
    functionFilters = null,
    navigationPropertyFilters = null
  ) => {
    const propertyFilters: any = {
      logic: "and",
      filters: [],
    };

    const filterQueryStrings: any = {
      propertyFiltersQueryString: "",
      functionFiltersQueryString:
        ContainerHelperMethods.getFunctionFiltersQueryString(functionFilters),
      navigationPropertyFilterQueryString:
        ContainerHelperMethods.getNavigationPropFiltersQueryString(
          navigationPropertyFilters
        ),
    };

    Object.keys(filters).forEach((k) => {
      const filterValue = filters[k].value;
      const operator = filters[k].operator ?? "eq";
      const filterType = filters[k].type;
      const logic = filters[k].logic ?? "or";

      if (
        !Array.isArray(filterValue) &&
        (filterValue instanceof Date || filterType === "datetime")
      ) {
        const value =
          typeof filterValue === "string" ? new Date(filterValue) : filterValue; // Need this check because when parsing stringified object from local storage then Datetime object becomes string so we need to convert it back to Date object
        propertyFilters.filters.push({
          field: k,
          value,
          operator,
          key: k,
        });
      } else if (
        typeof filterValue === "string" ||
        typeof filterValue === "number" ||
        typeof filterValue === "boolean" ||
        filterValue === null
      ) {
        if (k.includes(";")) {
          // Multi-filter (filtering more than one fields with one filter by using field name like 'Field1;Field2;Field3')
          const multiFilter: any = {
            key: k,
            filters: [],
            logic,
          };
          propertyFilters.filters.push(multiFilter);

          k.split(";").forEach((field) => {
            multiFilter.filters.push({
              field,
              value: filterValue,
              operator,
            });
          });
        } else
          propertyFilters.filters.push({
            field: k,
            value: filterValue,
            operator,
            key: k,
          });
      } else if (Array.isArray(filterValue) && filterValue.length > 0) {
        propertyFilters.filters.push({
          key: k,
          filters: [],
          logic,
        });
        filterValue.forEach((v, ind) => {
          const value = v.value ? v.value : v;
          const isDateTime = filterType === "datetime";
          const multipleOperators = Array.isArray(operator);
          const filterOperator = multipleOperators ? operator[ind] : operator;

          const proccessedValue =
            isDateTime && typeof value === "string" ? new Date(value) : value; // Need this check because when parsing stringified object from local storage then Datetime object becomes string so we need to convert it back to Date object
          const index = propertyFilters.filters.findIndex(
            (f: any) => f.key === k
          );

          if (index >= 0) {
            let filterToAssign = {
              field: k,
              value: proccessedValue,
              operator: filterOperator,
            };
            if (v.value) filterToAssign = { ...filterToAssign, ...v };
            propertyFilters.filters[index].filters.push(filterToAssign);
          }
        });
      }
    });

    filterQueryStrings.propertyFiltersQueryString =
      serializeFilter(propertyFilters);

    return filterQueryStrings;
  };

  /**
   * Method will use navigationPropertyFilters map(from filter instance) to generate query string(with lambdas (and lambda custom expressions)). Should be used in conjunction with upper method and then both results should be passed, as args, to toODataStr method to get complete query string for grid method request
   * @param {Object} navigationPropertyFilters
   */
  static getNavigationPropFiltersQueryString = (
    navigationPropertyFilters: any
  ) => {
    if (!navigationPropertyFilters || navigationPropertyFilters.length === {})
      return null;
    let groupedFilters: any = [];
    let query = "";

    Object.keys(navigationPropertyFilters).forEach((f) => {
      const filter = navigationPropertyFilters[f];

      if (
        groupedFilters.some(
          (gf: any) => gf.navigationProperty === filter.navigationProperty
        )
      ) {
        groupedFilters = groupedFilters.map((gf: any) => {
          if (gf.navigationProperty === filter.navigationProperty) {
            return {
              navigationProperty: filter.navigationProperty,
              values: filter.generatedExpression
                ? gf.values
                : [...gf.values, { field: f, value: filter.value }],
              generatedExpressions: filter.generatedExpression
                ? [...gf.generatedExpressions, filter.generatedExpression]
                : gf.generatedExpressions,
            };
          }
          return gf;
        });
      } else {
        groupedFilters.push({
          navigationProperty: filter.navigationProperty,
          values: filter.generatedExpression
            ? []
            : [{ field: f, value: filter.value }],
          generatedExpressions: filter.generatedExpression
            ? [filter.generatedExpression]
            : [],
        });
      }
    });

    if (groupedFilters.length > 0) {
      groupedFilters.forEach((f: any, ind: number) => {
        // Here we can see one limitation of this helper method => we are forced to use 's' as input parameter in lambda expression when populating filters
        // We can add mechanism to support any other letter but since the scope of this method is not big(only few of us devs are using this), then we should not add additional complexity just for that purpose
        query += `${f.navigationProperty}/any(s: {expressionPart})`;
        let expressionPart = "";

        if (f.generatedExpressions && f.generatedExpressions.length > 0) {
          f.generatedExpressions.forEach((ce: any, i: number) => {
            if (i === f.generatedExpressions.length - 1)
              expressionPart += ` ${ce}`;
            else expressionPart += ` ${ce} and`;
          });
        }

        if (f.values && f.values.length > 0) {
          if (expressionPart) expressionPart += " and";
          f.values.forEach((v: any, index: number) => {
            if (Array.isArray(v.value) && v.value.length > 0) {
              expressionPart += ` (`;
              v.value.forEach((vv: any, i: number) => {
                let value = vv.value ? vv.value : vv;
                if (!isBoolean(value)) value = `'${value}'`;
                if (i === v.value.length - 1)
                  expressionPart += ` s/${v.field} eq ${value})`;
                else expressionPart += ` s/${v.field} eq ${value} or`;
              });
            } else {
              let value = v.value;
              if (!isBoolean(value)) value = `'${value}'`;
              expressionPart += ` (s/${v.field} eq ${value})`;
            }
            if (index < f.values.length - 1) expressionPart += " and";
          });
        }

        query = query.replace("{expressionPart}", expressionPart);
        if (ind < groupedFilters.length - 1) query += " and ";
      });
    }
    return query;
  };

  /**
   * Concats function filter strings into one string
   * @param {Object[]} functionFilters function filters array - part of filter instance
   */
  static getFunctionFiltersQueryString = (functionFilters: any) => {
    let queryString = "";
    if (Array.isArray(functionFilters) && functionFilters.length > 0) {
      functionFilters.forEach((ff, ind) => {
        if (ind === 0) queryString += `${ff.queryString}`;
        else queryString += ` and ${ff.queryString}`;
      });
    }
    return queryString;
  };

  static generateODataFilterString = (filters: any) => {
    const {
      propertyFiltersQueryString,
      navigationPropertyFilterQueryString,
      functionFiltersQueryString,
    } = ContainerHelperMethods.getFilterStrings(
      filters.propertyFilters,
      filters.functionFilters,
      filters.navigationPropertyFilters
    );

    const odataFilterQuery = concatFilterQuerySubstrings(
      propertyFiltersQueryString,
      navigationPropertyFilterQueryString,
      functionFiltersQueryString
    );

    return odataFilterQuery.replace(
      /('[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}')/gi,
      (x) => x.substring(1, x.length - 1)
    );
  };
}
