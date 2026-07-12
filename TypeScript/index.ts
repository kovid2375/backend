
// The basics --type inference--

//declaring variable with explicit type
let name:string="kovid"
let age:number=23
let isActive:boolean=true

console.log(name,age,isActive)

// Array - two ways , same thing

let skills:string[] = ["react","ts"]
let scores:Array<number>=[90,85]
console.log(skills,scores)

let fruits:[string,number,string]=["orange",10,"big"]
console.log(fruits)

// Tuple -> fixed length and fixed types, fixed order
let point:[number,number]=[10,20]
let user:[string,number,boolean]=["kovid",23,true]
console.log(user,point)


// any vs unknown -> any turns off TypeScript completely, unknown forces you to check befire using . alwayes prefer unkown over any 

let danger:any = "hello"
danger.toUpperCase()    // no error - but what if it was a number?
//danger.nonExistentMethod() still no error . scary 

let safe:unknown="hello"
//safe.toUpperCase() -> ERROR! must check type first 

if ( typeof safe === "string"){
    safe.toUpperCase() // now no error 
}
console.log(danger , safe)

// void vs never -> void = function returns nothing, never = function literally never finishes (throws or infinite loops)

function logMessage(msg:string):void{
    console.log(msg)// returns nothing
}
function crash(error:string):never{
    throw new Error(error) // never returns anything 
}
logMessage("hello")



// FUNCTIONS + TYPE INFERENCE->

//basic function typing 

function add(a:number,b:number):number{
    return a+b;
}
console.log(add(2,3))

// optional param (?) and default param 

function greet(name:string, greeting?:string):string{
    return `${greeting?? "hello"}, ${name}!`
}
console.log(greet("kovid"))
console.log(greet("kovid", "hi"))

function createUser(name:string, role:string="viewer"){
    return{name, role }

}
console.log(createUser("kovid"))
console.log(createUser("kovid", "admin"))

// Return type inference - TS figures it out 

function multiply(a:number, b:number){
    return a*b 
}
console.log(multiply(2,3))   // TS knows this returns a number!

//Arrow functions - Same rules apply

const subtract = (a:number, b:number):number => a-b
console.log(subtract(5,2))

// Type Inference in Object Properties - TS figures it out for objects too!

function createUser2(name:string, role:string){
    return{name, role }
}
const user2 = createUser2("kovid", "admin")
console.log(user2.name)
console.log(user2.role)

//Generic function -> works with any type 

function getFirst<T>(arr:T[]):T {
    return arr[1]

}
console.log(getFirst([1,2,3])) //returns number
console.log(getFirst(["a","b","c"])) //returns string

// Identity wrapper -> another classic example 

function wrap<K>(value:K):{value:K}{
    return {value}
}


// OBJECTS , INTERFACES and TYPES ->


export {};
