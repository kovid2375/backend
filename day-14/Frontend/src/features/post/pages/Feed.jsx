import React from 'react'

const Feed = () => {
  return (
    <main className='flex items-start justify-center'>//feedpage
        <div className='max-w-[320px] w-full'>//feed
            <div className='w-full'>//posts
                <div className='w-full flex flex-col gap-2'>//post
                    <div className='flex gap-2 items-center' >//user
                    <img className='w-8 rounded-full aspect-square' src="https://images.unsplash.com/photo-1460904577954-8fadb262612c?q=80&w=1090&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
                    <p>Username</p>
                </div>
                <img className='w-full' src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Z2lybHxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                <div>//bottom
                    <p>Description</p>//caption
                </div>
                </div>
            </div>
        </div>
    </main>
  )
}

export default Feed
