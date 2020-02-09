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

## Attribution
*Functional JavaScript* by Michael Fogus (O’Reilly). Copyright 2013 Michael Fogus, 978-1-449-36072-6.
