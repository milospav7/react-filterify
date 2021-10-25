// import React, { useCallback, useEffect, useMemo, useState } from 'react';
// import { useDispatch } from 'react-redux';
// import debounce from 'debounce-promise';
// import buildQuery from 'odata-query';
// import { AxiosResponse } from 'axios';

// import { useFilterifyFilter } from '../outageManagement/IntentionalOutage/shared/custom_hooks';
// import { IpsAsyncSelect } from './formControls';
// import { updateNavigationPropertyFilter, updatePropertyFilter } from './store/sharedActions';
// import toast from './toasts/toast';
// import { AnyObject } from '../../interfaces/common.interface';

// interface IProps {
// 	containerId: string;
// 	asyncGetMethod: (url?: null, queryParams?: string) => Promise<AxiosResponse<any>>;
// 	filterSearchProperty: string;
// 	filterOptionLabelProperty: string;
// 	filterOptionValueProperty: string;
// 	isNavigationProperty?: boolean;
// 	filteringProperty: string;
// 	isClearable?: boolean;
// 	navigationProperty?: string;
// 	isNestedNavigationProperty?: boolean;
// 	isMulti?: boolean;
// 	size?: string;
// 	optionComponent?: any;
// 	filterOutNullOrEmptyRecords?: boolean;
// 	fixedFilters?: AnyObject;
// 	groupByFields?: Array<string>;
// }

// const AsyncDropdownFilter: React.FC<IProps> = ({
// 	containerId,
// 	asyncGetMethod,
// 	filterSearchProperty,
// 	filterOptionLabelProperty,
// 	filterOptionValueProperty,
// 	fixedFilters,
// 	filteringProperty,
// 	groupByFields,
// 	isNavigationProperty = false,
// 	isClearable = false,
// 	navigationProperty = '',
// 	isNestedNavigationProperty = false,
// 	isMulti = false,
// 	size = '',
// 	optionComponent = null,
// 	filterOutNullOrEmptyRecords = true,
// }) => {
// 	const { propertyFilters, navigationPropertyFilters } = useFilterifyFilter(containerId);
// 	const [options, setOptions] = useState({
// 		list: [],
// 		nextLink: null,
// 		loading: true,
// 	});
// 	const dispatcher = useDispatch();

// 	const propValue = propertyFilters[filteringProperty]?.value;
// 	const navPropValue = navigationPropertyFilters[filteringProperty]?.value;

// 	const fixedDataFilter = useMemo(() => {
// 		let fixedFilter: AnyObject = filterOutNullOrEmptyRecords
// 			? { [filterOptionLabelProperty]: { ne: null }, [filterOptionLabelProperty]: { ne: '' } }
// 			: {};

// 		if (fixedFilters) {
// 			Object.keys(fixedFilters).forEach((filterField) => {
// 				const value = fixedFilters[filterField]?.value;
// 				const operator = Array.isArray(value) ? 'in' : 'eq';

// 				fixedFilter[filterField] = { [operator]: value };
// 			});
// 		}

// 		return fixedFilter;
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [filterOutNullOrEmptyRecords, filterOptionLabelProperty, fixedFilters]);

// 	const dataTransformation = useMemo(() => {
// 		let transform: Array<any> = [];

// 		if (groupByFields) {
// 			const fields = groupByFields.filter((field: string) =>
// 				Object.keys(fixedDataFilter).some((ff) => ff === field)
// 			);
// 			if (fields.length)
// 				transform = [
// 					{
// 						groupBy: {
// 							properties: fields,
// 						},
// 					},
// 				];
// 		}
// 		return transform;
// 	}, [groupByFields, fixedDataFilter]);

// 	// Filter will reset whenever fixed filters or data transfomator change externally (through props)
// 	useEffect(() => {
// 		setOptions((p) => ({ ...p, loading: true, list: [] }));
// 		asyncGetMethod(null, buildQuery({ filter: fixedDataFilter, transform: dataTransformation }))
// 			.then((response: any) => {
// 				const nextLink = response.data['@odata.nextLink'];
// 				const opts = response.data.value;
// 				setOptions((prevState) => ({ ...prevState, nextLink, list: opts, loading: false }));
// 			})
// 			.catch((err: any) => {
// 				toast.errorWithModalLink(err);
// 				setOptions((p) => ({ ...p, loading: false }));
// 			});
// 	}, [asyncGetMethod, fixedDataFilter, dataTransformation]);

// 	const updateCorrespondingFilter = useCallback(
// 		(option) => {
// 			if (isNavigationProperty) {
// 				dispatcher(
// 					updateNavigationPropertyFilter(
// 						containerId,
// 						navigationProperty,
// 						filteringProperty,
// 						option,
// 						null,
// 						isNestedNavigationProperty
// 					)
// 				);
// 			} else dispatcher(updatePropertyFilter(containerId, filteringProperty, option));
// 		},
// 		[
// 			isNavigationProperty,
// 			containerId,
// 			navigationProperty,
// 			filteringProperty,
// 			isNestedNavigationProperty,
// 			dispatcher,
// 		]
// 	);

// 	const filterValue = useMemo(() => {
// 		if (isNavigationProperty) {
// 			if (navPropValue !== undefined)
// 				return navigationPropertyFilters[filteringProperty].type === 'boolean'
// 					? options.list.find((opt: any) => opt.value === JSON.stringify(navPropValue))
// 					: navPropValue;
// 			return null;
// 		}

// 		if (propValue !== undefined)
// 			return propertyFilters[filteringProperty].type === 'boolean'
// 				? options.list.find((opt: any) => opt.value === JSON.stringify(propValue))
// 				: propValue;

// 		return null;
// 	}, [
// 		propValue,
// 		navPropValue,
// 		filteringProperty,
// 		isNavigationProperty,
// 		options,
// 		navigationPropertyFilters,
// 		propertyFilters,
// 	]);

// 	const getFilteredOptions = useCallback(
// 		async (input) => {
// 			try {
// 				if (!input) return [];
// 				const filter = {
// 					and: [{ [filterSearchProperty]: { contains: input } }, fixedDataFilter],
// 				};

// 				const response = await asyncGetMethod(
// 					null,
// 					buildQuery({ filter, transform: dataTransformation })
// 				);
// 				return response.data.value.map((opt: any) => ({
// 					value: opt[filterOptionValueProperty],
// 					label: opt[filterOptionLabelProperty],
// 					...opt,
// 				}));
// 			} catch (err) {
// 				toast.errorWithModalLink(err);
// 				return [];
// 			}
// 		},
// 		[
// 			asyncGetMethod,
// 			fixedDataFilter,
// 			filterOptionLabelProperty,
// 			filterOptionValueProperty,
// 			filterSearchProperty,
// 			dataTransformation,
// 		]
// 	);

// 	const getNextPortion = useCallback(() => {
// 		const { nextLink } = options;
// 		if (nextLink)
// 			asyncGetMethod(nextLink)
// 				.then((response: any) => {
// 					const nextLink = response.data['@odata.nextLink'];
// 					const newoptions = response.data.value;
// 					setOptions((prevState: any) => ({
// 						...prevState,
// 						nextLink,
// 						list: [...prevState.list, ...newoptions],
// 					}));
// 				})
// 				.catch((err: any) => {
// 					toast.errorWithModalLink(err);
// 				});
// 	}, [asyncGetMethod, options]);

// 	const debouncedLoadOptions = debounce(getFilteredOptions, 600, { leading: true });

// 	const memoizedFilter = useMemo(
// 		() => (
// 			<IpsAsyncSelect
// 				key={`asnc-flt-${filteringProperty}`}
// 				size={size}
// 				defaultOptions={options.list.map((opt: any) => ({
// 					value: opt[filterOptionValueProperty],
// 					label: opt[filterOptionLabelProperty],
// 					...opt,
// 				}))}
// 				value={filterValue}
// 				isMulti={isMulti}
// 				onChange={updateCorrespondingFilter}
// 				isClearable={isClearable}
// 				isLoading={options.loading}
// 				loadOptions={debouncedLoadOptions}
// 				onMenuScrollToBottom={getNextPortion}
// 				components={optionComponent}
// 			/>
// 		),
// 		[
// 			filterValue,
// 			options,
// 			optionComponent,
// 			debouncedLoadOptions,
// 			getNextPortion,
// 			filterOptionLabelProperty,
// 			filterOptionValueProperty,
// 			isMulti,
// 			isClearable,
// 			size,
// 			updateCorrespondingFilter,
// 			filteringProperty,
// 		]
// 	);

// 	return memoizedFilter;
// };

// export default AsyncDropdownFilter;

export {};
