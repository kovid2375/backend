
// 1. THE BASICS -->>

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



//2. FUNCTIONS + TYPE INFERENCE->

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


//3. OBJECTS , INTERFACES and TYPES ->

function printUser(user:{name:string,age:number}){
    console.log(user.name)
}
printUser({name:"kovid",age:23})

//Interface

interface User{
    id:number;
    name:string
    email?:string // optional
    readonly createdAt:Date // can't be changed after creation
}

//Type alias -> very similar to interface

type Product={
    id:number
    name:string
    price:number
}

// extending interfaces 

interface Admin extends User{
    permissions:string[]
}

// Intersection Types (& combines)
type AdminProduct=User & Product

//{-> Practical rule: Use interface for objects you will extend.Use type for everything else. Dont overthink it }

//4. UNIONS, INTERSECTIONS and NARROWING ->>

// this is the backbone of real TS usage. What makes TypeScript actually useful in apps 

//Union - one of these types 
type ID=string | number
type Status = "active" | "inactive" | "pending"

//typeof narrowing 
function processId(id:ID){
    if (typeof id ==="string"){
        return id.toUpperCase() //TS knows it's string here 
    }
    return id.toFixed(2) // TS knows its number here 
}

// "in" narrowing 
 type Cat={meow:()=> void}
 type Dog={bark:()=>void}

 function makeSound (animal:Cat | Dog){
    if("meow" in animal){
        animal.meow();// safe
    }else{
        animal.bark()
    }
 }


 // ⭐ Discriminated Unions -VERY IMPORTANT
 // Add a "kind"/"type" field to each variant 

 type LoadingState= {status:"loading"}
 type SuccessState={status:"success", data:string[] }
 type ErrorState={status:"error", message:string}

 type ApiState = LoadingState | SuccessState | ErrorState

 function render(state:ApiState){
    switch(state.status){
        case "loading":return "loading..."
        case "success":return state.data // data is available
        case "error": return state.message // message is available
    }

 }
 //you see it? TS narrows the type in each case block 


 //5.GENERICS - Practical Only ->>

 // generic function 

 function identity<T>(value:T):T{
    return value
 }

 type ApiResponse<T>={
    data:T
    success:boolean
    message:string
 }

 // now resue of any shape

 type UserResponse = ApiResponse<User>
 type ProductResponse = ApiResponse<Product[]>  
 

 //constraints with extends 

 function getProperty<T,K extends keyof T> (obj :T, key:K): T[K]{
    return obj[key]
 }

 const user3 = {name:"kovid", age:30}
getProperty(user3,"name")
// getProperty(user3,"xyz") -> error "xyz" is not in user 

//6. WORKING WITH API'S ->>

//1.Define the shape of what the API returns

interface Post{
    id:number
    title:string
    body:string 
    userId:number
}

//2. Generic fetch wrapper - reuse everywhere 

async function fetchData<T>(url:string):Promise<T>{
    const res =await fetch(url)
    if (!res.ok) throw new Error ("Failed to fetch ")
    return res.json() as Promise<T>

}

//3. Usage - fully typed! 

const post=await fetchData<Post>("https:// jsonplaceholder.typicode.com/post/1")
console.log(post.title) // TS knows this is a string 

//4. Handling unknown data safely 

async function safeFetch(url:string):Promise<unknown>{
    const res = await fetch(url)
    return res.json()
}

const raw = await safeFetch("...") // unknown
// Musr validate before using - use  Zod , or manual checks 

// {Always define an interface for API responses. Type the data , not just the fetch call. USe a generic wrapper so you don't repeat yourself}✅
//{ Dont use as any to "fix" type errors form fetch . You lose all safety and introudce bugs silently }❌

//7. TYPESCRIPT WITH REACT ->>

//1.Typing Props 
interface ButtonProps{
    label:string
    onClick:()=>void
    variant?:"primary" | "secondary"
    disabled?:boolean
}

// const Button = ({label, onClick , variant = "primary", disabled}:ButtonProps)=>{
//     <button onClick={onClick} disabled={disabled} className={variant}>
//         {label}
//     </button>
// }

//2. Typing childern 
interface CardProps{
    title:string
    // childern:React.ReactNode
}

// const Card =({title, children}:CardProps)=>(
//     <div><h2>{title} </h2>{children} </div>
// )

//3. useState - infer or exploicit 
// const [count,setCount]= useState<number>(0)
// const [user , setUser]=useState <User | null > (null)

//4. useEffect -> nothing special needed 

// useEffect(()=>{
//     const loadUser= async () =>{
//         const data = await fetchData<User>("/api/user")
//         setUser(data)
//     }
//     loadUser()
// },[])

//5. Event types - very common question!
// const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
//     console.log(e.target.value)
// }

// const handleSubmit=(e:React.FormEvent<HTMLFormElement>)=>{
//     e.preventDefault()
// }

// const handleClick=(e:React.MouseEvent<HTMLButtonElement>)=>{
//     console.log(e.currentTarget)
// }

//6. custom hook with return type 

// fuction useFetch<T>(url:string){
//     const [data,setData]=useState <T | null>(null)
//     const [loading, setLoading]=useState(true)
//     const[error,setError]= useState<string | null>(null)
// }

// useEffect(()=>{
//     fetchData<T>(url)
//     .then(setData)
//     .catch((err)=> setError(err.message))
//     .finally(()=>setLoading(false))
// },[url])

// return{data,loading,error}

// usage 
// const {data, loading}=useFetch<Post[]>("/api/posts")


// UTILITY TYPES ->> HIGH IMPACT ONLY

interface User{
    id:number
    name:string
    email?:string
    age:number 
}
//partial- all fields optional (great for update functions)
type UserUpdate=Partial<User>

// {id?: number; name?: string; email?: string; age?: number}
function updateUser(id:number,changes:Partial<User>){}

//Pick - take only what you need 
type UserPreview=Pick<User,"id"|"name">
//{id:number;name:string}

//omit -exclude what you dont need
type PublicUser=Omit<User,"email">
//{id:number; name:string; age:number}

//record- key-value mapping with typed keys and values 

type RoleMap= Record<"admin"|"editor"|"viewer",string[]>
const permissions:RoleMap={
    admin:["read","write","delete"],
    editor:["read","write"],
    viewer:["read"]
}

//Partial<T>-> all fields become optional. Use for update payloads, from state, PATCH requests
//Pick<T,K>-> select specific fields. Use for DTOs API response subsets, preview cards 
//omit<T,K>-> Exclude fields. Use to hide sensitive data (passwords,tokens)from public types 
//Record<K,V>-> typed dictionary/map.Use for permission maps,coches,config,objects 


//ERROR HANDLING and DEBUGGING TYPES 

//Common Ts error - "property X does not exist on type Y"
interface Car{brand:string}
const car:Car={brand:"Toyota"}
//car.speed; // Property 'speed' does not exist on type 'Car'
//Fix:Add speed to interface,or use optional chaining

//"Type X is not assignable to type Y"
let score:number =90
//score="ninety" // Type 'string' is not assignable to type 'number'


//Argument type mismatch 
function double(n:number){
    return n*2
}
//double("5") // argument of type 'string' is not assignable to parameter of type 'number' 

//"as"-type assertion. Use sparingly 

// OK- you know more than TS does (eg, DOM APIs)
const input = document.getElementById("name")as HTMLInputElement
console.log(input.value)

//OK- casting API response you've validated

const data=response as User;

//BAD- using "as" to silence errors (lying to TypeScript)

const broken ="hello" as unknown as number 
broken.toFixed()// crashes at runtime - Ts was fooled 

//Rule:"as" is for when YOU know better than TS
// Not for when you're too lazy to fix a real type error 

//HOW TO READ TS ERRORS-> Start from the bottom of the error stack . The first line describes what went wrong . the last line tells you where. Read both 

//QUICk DEBUG TRICK->
// Hover over any variable in VS Code to see its inferred type. if it shows any you need to fix something upstream 

//FIXING MISMATCHES->
// Dont silence error with as . Fix the type definition or the fucntion contract. the error is felling you something real 

//TS-EXPECT-ERROR->
//Use //@ts-expect-error instead of //@ts-ignore.it fails if the error disappears- a self-cleaning suppression

export {};
