import { children, createContext,useEffect,useState } from "react";
import { followUserApi,unfollowUserApi } from "./services/follow.api";
import axios from "axios";
export const FollowContext = createContext()
export const FollowContextProvider=({children})=>{
    const [following,setFollowing]=useState([])

    const follow = async (username) => {
        try{
            await followUserApi(username)
            setFollowing((prev)=>[...prev,username])
        } catch(err){
            console.log(err);
        }
    }

    const unfollow =async (username) => {
        try{
            await unfollowUserApi(username)
            setFollowing((prev)=> prev.filter(u=>u!==username))
        } catch(err){
            console.log(err);
        }
    
    }
   

    return (
        <FollowContext.Provider value={{following,follow,unfollow}}>
            {children}
        </FollowContext.Provider>
    )
    


    
}