import React from 'react'
import { RiHeart3Line, RiChatSmile2Line, RiShareForwardLine, RiBookmarkLine } from '@remixicon/react'
const Post = ({user,post}) => {
  return (
    <div>
      <div className='w-full flex flex-col gap-2 bg-[#333] px-2 py-2'>{/*post*/}
                    <div className='flex gap-2 items-center' > {/* user */}
                    <div className='rounded-full flex items-center justify-center  size-9 bg-conic from-purple-500 via-pink-500 to-blue-500'>{/*image- wrapper*/}
                        <img className='w-8 rounded-full aspect-square' src={user.profileImage} alt="" />
                    </div>
                    <p>{user.username}</p>
                </div>
                <img className='w-full' src={post.imgUrl} alt="" />
                <div className='flex justify-between '>{/* icons */}
                    <div className='flex flex-row gap-2'>{/**left */}
                        <button className={post.isLiked?"text-red-700" : ""}><RiHeart3Line /></button>
                        <button className='active:scale-85'><RiChatSmile2Line /></button>
                        <button className='active:scale-85'><RiShareForwardLine /></button>
                    </div>
                    <div>{/*right */}
                        <button className='active:scale-85'><RiBookmarkLine /></button>

                    </div>
                </div>
                <div>{/*bottom*/}
                    <p>{post.caption}</p>{/*caption*/}
                    <div/>
                </div>
                </div>
    </div>
  )
}

export default Post
