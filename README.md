# Project Overview

## JavaScript Dynamic To-Do App
I used plain JavaScript without any frameworks. For advanced functionalities, I utilized web APIs (e.g., drag-and-drop functionality). I completed all the requirements, including the bonus points. Certain aspects of my solution try to mimic how React handles components by using a modular render list function. I made the to-do list scrollable. This way, the app looks modern and stays in place.

### Executing the App
The app can be run without a development server. Simply open the `index.html` file in your browser.

## Python Algorithmic Tasks

### Task 1
I used dynamic programming to compute the result because the number of paths to a location is the sum of paths to the previously step-able locations.

### Task 2
For this task, I chose to use OOP because it is a more complex task and required a tree data structure. I converted the list of dictionaries into a dictionary of tree nodes. Because of the nature of dictionaries, I can access the nodes without the need for traversal of the tree nodes, so it is O(1), which is important when building the tree hierarchy. For the calculations of the propagated ratings, the tree data structure is very handy. I can use recursion, which makes the code readable and simple. Finally, I made a format method that sorts the results by IDs and formats the ratings to two decimal points for readability.
