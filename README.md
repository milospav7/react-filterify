## Author

Milos Pavlovic

## Purpose

Extensive support for data filtering, with flexible structure for querying both oData APIs and RESTful APIs. Particularly powerful when working with oData services since it's primary purpose is to simplify creation of dynamic oData filter query strings as end result.
On UI side it offers a wide choice of well-designed filter components with state management integrated with Redux, meaning it is an hooks-based library.

Built around publisher-subscribe pattern where controller should orchestrate the flow between filters and filters consumer, by providing information about where-to-push-filters to filter components, and by providing where-to-listen-for-change information to filters consumer, in an easy to use hooks based approach.

The **Redux Toolkit** package is intended to be the standard way to write Redux logic. It was originally created to help address three common concerns about Redux:

- "Configuring a Redux store is too complicated"
- "I have to add a lot of packages to get Redux to do anything useful"
- "Redux requires too much boilerplate code"

## What's Included

React Filterify includes these APIs:

- `configureFilterfyReducer()`: usage is required and provide simplified configuration for filter container instances that will be used accros the application - container simply represents wrapper, register by unique id, that will be used to maintain all filters related to itself.
- `useFilterSubscription()`: provide a way to susbscribe to any container change, by exposing event which can be used in order to trigger desired action when any filter, inside filter container, changes - basically the way to connect filters with any application component intented to consume them.
- `useFilterifyFilter()`: on demand exposing of current container state

React Filterify includes these generic components:

- `DropdownFilter`: filter in form of dropdown, supporting both multiselect and singleselect modes
- `TextFilter`: filter in form of input field, with proper debounce, supporting multiple operators inherent in text manipulation
- `NumericFilter`: filter in form of input field, with proper debounce, supporting multiple operators inherent in numbers manipulation
- `DatetimeFilter`: filter in form of datetime selector field
- `ButtonGroupFilter`: filter in form of button group, supporting both multiselect and singleselect modes
- `BooleanFilter`: filter in form of dropdown(Yes/No options)

All generic components have well structured API, with a set of common props related with configuration of property which filter should be bound with, and with set of props related with styling components. All this results in an imperceptible difference, from the code level, when using any generic component.
