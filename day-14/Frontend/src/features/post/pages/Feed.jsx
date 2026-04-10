import React, { useEffect } from 'react'

import Post from '../components/Post'
import { usePost } from '../hooks/usePost'
import Nav from '../components/Nav'
import { useNavigate } from 'react-router-dom'

const Feed = () => {

    const navigate=useNavigate()

    const{feed,handelGetFeed,loading,handelLikePost,handelunLikePost}=usePost()

    useEffect(()=>{
        handelGetFeed()
    },[])
    if(loading || !feed){
        return <h1 className='min-h-screen w-full flex items-center justify-center'>Loading...</h1>
    }
    console.log(feed);

    
    
  return (
    <main className='flex items-center justify-center flex-col'> {/*feed page */}
        <Nav/>
        <div className='max-w-[320px] w-full'>{/*feed */}
            <div className='w-full flex flex-col gap-2'>{/*posts*/}
               {feed.map(post=>{
                return <Post user={post.user} post={post} loading={loading} handelLikePost={handelLikePost} handelunLikePost={handelunLikePost}/>
               })}
            </div>
        </div>
    </main>
  )
}

export default Feed
