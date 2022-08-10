## Author

Milos Pavlovic

## Purpose

Extensive support for data filtering, with flexible structure for querying RESTful API. Particularly powerful when working with RESTful API implementing OData protocol, since its primary purpose is to simplify creation of dynamic OData filter query string as end result.

On UI side it offers a wide choice of well-designed filter components with state management integrated with Redux. Hooks-based library with ceratin number of powerful hooks exposed for filters container subscription, container state insight, computed filter query string based on latest container state etc..

Abstracts away complexity required for creating filters bounded on entity's properties on different levels - support for property filters, navigation property filters (filtering on related entity/es property) and function filters (any custom expression applicable as filter on ceratin entity property).

Built around publish-subscribe pattern where controller should orchestrate the flow between filters and filters consumer, by providing information about where-to-push-filters to filter components, and by providing where-to-listen-for-change information to filters consumer, in an easy to use hooks based approach.

## What's Included

React Filterify includes these APIs:

- `configureFilterfyReducer()`: usage is required and provides simplified configuration for filter container instances that will be used across the application - container simply represents wrapper, registered by unique id, that will be used to maintain all filters related to itself. Configurator is simply a starting point of library usage,  required step to set reducer per container when creating application redux store - it connects containers to their dedicated memory space in store.
- `useContainerSubscription()`: provide a way to subscribe to container and listen for changes, by exposing event which can be used in order to trigger desired action when any filter, inside filter container, changes - basically the way to connect filters with any application component intended to consume them.
- `useContainerState()`: on-demand exposing of container current state.
- `useODataFilterQuery`: interface useful when working with OData API. Generates OData filter query string by using the container current state, and recomputing query string output each time container state changes.

React Filterify includes these generic components:

- `DropdownFilter`: filter in form of dropdown, supporting both multiselect and singleselect modes
- `TextFilter`: filter in form of input field, with proper debounce, supporting multiple operators inherent in text manipulation
- `NumericFilter`: filter in form of input field, with proper debounce, supporting multiple operators inherent in numbers manipulation
- `DatetimeFilter`: filter in form of datetime selector field
- `ButtonGroupFilter`: filter in form of button group, supporting both multiselect and singleselect modes
- `BooleanFilter`: filter in form of dropdown(Yes/No options)

All generic components have well structured API, with a set of common props related with configuration of property which filter should be bound with, and with set of props related with styling components. All this results in an imperceptible difference, from the code level, when using any generic component.

## Todo
- Pixel-perfect unification of filters design(height, placeholders, font size etc..)
- Support for operators show/hide flag on reducer configuration level
- Other(more complex) filters should be handled with custom filter schema prop(eg: customSchema="Users/any(u: u/Books/any(b: b/Name eq {{value}}))")
- Introduce 'type' parameter in filter description (number, boolean, string, datetime, etc..)
- Optional exclude of ceratin built-in operator/s
- Extend documentation with real examples
- Async dropdown filter to support searchable and dynamic dropdown options, not just static ones as supported with DropdownFilter component
