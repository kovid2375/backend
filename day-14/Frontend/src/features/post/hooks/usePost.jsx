import { getFeed , createPost,likePost,unlikePost} from "../services/post.api";
import { useContext, useEffect } from "react";
import { PostContext } from "../post.context";

export const usePost=()=>{
    const context= useContext(PostContext)

    const {loading,setLoading,post,setPost,feed,setFeed}=context


    const handelGetFeed=async ()=>{
        setLoading(true)
        const data = await getFeed()
        setFeed(data.post)
        setLoading(false)
    
    }
    const handelCreatePost= async (imageFile,caption) => {
        setLoading(true)
        const data = await createPost(imageFile,caption)
        setFeed([data.post,...feed])
        setLoading(false)
    
    }

    const handelLikePost=async (post) => {
        
        const data = await likePost(post)
        await handelGetFeed()
        
        

    
    }
    const handelunLikePost=async (post) => {
        
        const data = await unlikePost(post)
        await handelGetFeed()
        
        
    }




    useEffect(()=>{
        handelGetFeed()
    },[])





    return{loading ,feed,post,handelGetFeed,handelCreatePost,handelLikePost,handelunLikePost}

    
}