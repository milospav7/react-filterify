## Author
 Milos Pavlovic

## Library description
Extensive support for data filtering, with flexible structure for querying both oData APIs and RESTful APIs. Particularly powerful when working with oData services since it's primary purpose is to simplify creation of dynamic oData filter query strings as end result. 
On UI side it offers a wide choice of well-designed filter components with state management integrated with Redux. Hooks-based library.
Built around publisher-subscribe pattern where controller should orchestrate the flow between filters and filters consumer, by providing information about where-to-push-filters to filter components, and by providing where-to-listen-for-change information to filters consumer, in an easy to use hooks based approach.
