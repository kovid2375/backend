// The basics --type inference--
//declaring variable with explicit type
let name = "kovid";
let age = 23;
let isActive = true;
console.log(name, age, isActive);
// Array - two ways , same thing
let skills = ["react", "ts"];
let scores = [90, 85];
console.log(skills, scores);
let fruits = ["orange", 10, "big"];
console.log(fruits);
// Tuple -> fixed length and fixed types, fixed order
let point = [10, 20];
let user = ["kovid", 23, true];
console.log(user, point);
// any vs unknown -> any turns off TypeScript completely, unknown forces you to check befire using . alwayes prefer unkown over any 
let danger = "hello";
danger.toUpperCase(); // no error - but what if it was a number?
//danger.nonExistentMethod() still no error . scary 
let safe = "hello";
//safe.toUpperCase() -> ERROR! must check type first 
if (typeof safe === "string") {
    safe.toUpperCase(); // now no error 
}
console.log(danger, safe);
// void vs never -> void = function returns nothing, never = function literally never finishes (throws or infinite loops)
function logMessage(msg) {
    console.log(msg); // returns nothing
}
function crash(error) {
    throw new Error(error); // never returns anything 
}
logMessage("hello");
// FUNCTIONS + TYPE INFERENCE->
//basic function typing 
function add(a, b) {
    return a + b;
}
console.log(add(2, 3));
// optional param (?) and default param 
function greet(name, greeting) {
    return `${greeting ?? "hello"}, ${name}!`;
}
console.log(greet("kovid"));
console.log(greet("kovid", "hi"));
function createUser(name, role = "viewer") {
    return { name, role };
}
console.log(createUser("kovid"));
console.log(createUser("kovid", "admin"));
// Return type inference - TS figures it out 
function multiply(a, b) {
    return a * b;
}
console.log(multiply(2, 3)); // TS knows this returns a number!
//Arrow functions - Same rules apply
const subtract = (a, b) => a - b;
console.log(subtract(5, 2));
// Type Inference in Object Properties - TS figures it out for objects too!
function createUser2(name, role) {
    return { name, role };
}
const user2 = createUser2("kovid", "admin");
console.log(user2.name);
console.log(user2.role);
//Generic function -> works with any type 
function getFirst(arr) {
    return arr[1];
}
console.log(getFirst([1, 2, 3])); //returns number
console.log(getFirst(["a", "b", "c"])); //returns string
// Identity wrapper -> another classic example 
function wrap(value) {
    return { value };
}
// OBJECTS , INTERFACES and TYPES ->
function printUser(user) {
    console.log(user.name);
}
printUser({ name: "kovid", age: 23 });
export {};
