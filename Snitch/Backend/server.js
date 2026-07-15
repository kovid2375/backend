

import app from "./src/app.js";
import connectedDB from "./src/config/db.js";

const startServer=async ()=>{
    try{
        await connectedDB()
        app.listen(3000,()=>{
            console.log("server is running on port 3000")
        })
    }
    catch (error){
        console.log("error in starting server",error)
    }
}

startServer()

