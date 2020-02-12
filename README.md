# Notes and Working Examples from Functional Javascript by Michael Fogus

## Chapter 1. Introducing Functional JavaScript
  - Identify an abstraction and build a function for it
  - Use existing functions to build more complex abstractions
  - Pass existing functions to other functions to build even more complex abstractions
  - Functional programming works best when implemented with data abstractions

## Chapter 2. First-Class Functions and Applicative Programming
  - First-class functions can be treated like any other piece of data:
    - Store in a variable
    - Store in an array slot
    - Store in an object field
    - Created as needed
    - Passed to other functions
    - Returned from functions
  - Higher-order functions can take a function as an argument and/or return a function as a result
  - Applicative programming techniques are effective when working with collections of data

## Chapter 3. Variable Scope and Closures 
  - Global scope is scope accessible to every function in a program
  - Lexical scope refers to the visibility of a variable and its value analogous to its textual representation. Variable lookup starts at the closest binding context and expands outward until it finds a binding.
  - Dynamice scope can be practiced in JavaScript by manipulating the *this* reference
  - Function-local variables live only for the lifetime of a function's body
  - Closures are a method to pass around ad hoc encapsulated states

## Chapter 4. Higher-Order Functions
  - A Higher-Order function takes a function as an argument and/or returns a function as a result.
  - Functions can be made more generic by pass a function as an argument rather than a value
  - Functions returning functions allow for building powerful functions
  - Currying is a technique of returning a function from another function - taking advantage of captured arguments

## Chapter 5. Function-Building Functions
  - A curried function is one that returns a new function for every logical argument that it takes
  - Currying is a useful technique for specifying the specialized behavior of JavaScript functions and for 'composing' new functions from existing functions
  - If an API utilizes high-order funcitons, consider using curried functions for at least on parameter
  - With function composition, code becomes more declarative (i.e., it says what it's supposed to do rather than how)
  - The _.compose higher-order function provided a pre- and post-condition function 'decorator', using a small amount of code

## Chapter 6. Recursion
  - Recursion is important to functional programming for three reasons:
    1. Recursive solutions involve the use of a single abstraction applied to subsets of a common problem
    2. Recursion can hide mutable state
    3. Recursion is one way to implement laziness and infinitely large structures
  - Recursive functions should not change the arguments given to them
  - When writing self-recursive functions:
    1. Know when to stop
    2. Decide how to take one step
    3. Break the problem into that step and a smaller problem
  - An accumulator argument is a common technique in recursion for communicating information from one recursive call to the next
  - Using a nested function is a common way to hide accumulators in recursive calls
  - Two or more functions that call each other are known as mutually recursive
  - Recursin should be seen as a low-level operation and avoided if possible. A better path is to plug higher-order functions together if possible.

## Chapter 7. Purity, Immutability, and Policies for Change
  - Functional programming is a way of thinking about how to build programs to minimize the complexities inherent in the creation of software
  - A pure function adheres to the following properties:
    1. Its result is calculated only from the values of its arguments
    2. It cannot rely on data that changes external to its control
    2. It cannot change the state of something external to its body
  - Observing a functional style that adheres to a standard of purity where possible will make programs easier to test, and easer to reason about
  - Pure functions allow for easy composition of functions and makes replacing any given function trivial
  - Idempotence is the idea that executing an activity numberous times has the same effect as executing it once  
  - Use a function as a boundary for locatl state mutation, shielding change from the sight of external code
  - Immutable objects should get their values at construction time and never again change
  - Operations on immutable objects return fresh objects

## Chapter 8. Flow-Based Programming
  - Method chaining is enabled by returning the same host object reference from each method
  - A function that wraps some behavior for later execution is typically called a *thunk*
  - There are various downsides to method chaining including tight-coupling of object set and get logic and mutation of a common reference
  - Functional APIs work with values rather than references and return a transformed result
  - Build powerful abstractions by inserting pipelines into another pipeline
  - Pipelines coupled with currying and partial application provide a powerful way to compose functions in a fluent manner

## Attribution
*Functional JavaScript* by Michael Fogus (O’Reilly). Copyright 2013 Michael Fogus, 978-1-449-36072-6.
