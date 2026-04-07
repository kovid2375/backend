import React, { useEffect } from 'react'

import Post from '../components/post'
import { usePost } from '../hooks/usePost'

const Feed = () => {

    const{feed,handelGetFeed,loading}=usePost()

    useEffect(()=>{
        handelGetFeed()
    },[])
    if(loading || !feed){
        return <h1 className='min-h-screen w-full flex items-center justify-center'>Loading...</h1>
    }
    console.log(feed);
    
  return (
    <main className='flex items-start justify-center'> {/*feed page */}
        <div className='max-w-[320px] w-full'>{/*feed */}
            <div className='w-full flex flex-col gap-2'>{/*posts*/}
               {feed.map(post=>{
                return <Post user={post.user} post={post}/>
               })}
            </div>
        </div>
    </main>
  )
}

export default Feed
