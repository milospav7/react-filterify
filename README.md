## Author

Milos Pavlovic

## Purpose

Extensive support for data filtering, with flexible structure for querying both OData APIs and RESTful APIs. Particularly powerful when working with oData services since its primary purpose is to simplify creation of dynamic oData filter query string as end result.

On UI side it offers a wide choice of well-designed filter components with state management integrated with Redux. Hooks-based library with ceratin number of powerful hooks exposed for filters container subscription, container state insight, computed filter query string based on latest container state etc..

Abstracts away complexity required for creating filters bounded on entity's properties on different levels - support for property filters, navigation property filters (filtering on related entity/es property) and function filters (any custom expression applicable as filter on ceratin entity property).

Built around publish-subscribe pattern where controller should orchestrate the flow between filters and filters consumer, by providing information about where-to-push-filters to filter components, and by providing where-to-listen-for-change information to filters consumer, in an easy to use hooks based approach.

`***` When fully developed (I hope really soon) it will be shipped as npm package. What I now do is mostly refactoring since I initially developed this solution in late 2020 and recently decided to isolate it on my github repo in order to refactor, improve and I hope to build a package from itself so I can share it with anyone and together make it even better. I developed initial version in late 2020, as a part of really complex project, after problems with data filtering escalated to the level where creation of new, and maintaining of existing filters, become a real nightmare, all that as a consequence of huge complexity and number of required filters applied on different tables.

## What's Included

React Filterify includes these APIs:

- `configureFilterfyReducer()`: usage is required and provides simplified configuration for filter container instances that will be used across the application - container simply represents wrapper, registered by unique id, that will be used to maintain all filters related to itself. Configurator is simply a starting point of library usage,  required step to set reducer per container when creating application redux store - it connects containers to their dedicated memory space in store.
- `useContainerSubscription()`: provide a way to subscribe to any container change, by exposing event which can be used in order to trigger desired action when any filter, inside filter container, changes - basically the way to connect filters with any application component intended to consume them.
- `useContainerState()`: on-demand exposing of current container state.
- `useGeneratedODataFilterQueryString`: interface useful when working with OData API. Dynamic generator of OData filter query string by using the current container state, and recomputing query string output each time container state change.

React Filterify includes these generic components:

- `DropdownFilter`: filter in form of dropdown, supporting both multiselect and singleselect modes
- `TextFilter`: filter in form of input field, with proper debounce, supporting multiple operators inherent in text manipulation
- `NumericFilter`: filter in form of input field, with proper debounce, supporting multiple operators inherent in numbers manipulation
- `DatetimeFilter`: filter in form of datetime selector field
- `ButtonGroupFilter`: filter in form of button group, supporting both multiselect and singleselect modes
- `BooleanFilter`: filter in form of dropdown(Yes/No options)

All generic components have well structured API, with a set of common props related with configuration of property which filter should be bound with, and with set of props related with styling components. All this results in an imperceptible difference, from the code level, when using any generic component.

## Todo
- Usage of global style schema(per container) defined in configured filterify reducer
- Extend documentation with real examples
- Unit testing
- Async dropdown filter to support searchable and dynamic dropdown options, not just static ones as supported with DropdownFilter component
- Feature related with OData filtering: support for multi-level filter on navigation properties (so far it is supported only first level nav prop filtering, e.g. Books/any(b: b/Name eq 'Clean Code'), and it should be useful to support creation of something like Books/any(b: b/Publishers/any(p: p/Name eq 'Nora Library')) )
- Exposed generator for GraphQl query (using the latest state of container filters in memory)
