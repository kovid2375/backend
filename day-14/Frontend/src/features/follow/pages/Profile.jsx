import React, { useEffect, useState } from 'react'
import  useFollow  from '../hooks/useFollow'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { RiInstagramLine } from '@remixicon/react'




const Profile = () => {
    
    const[currentUser,setCurrentUser]=useState(null)
    const [allUsers, setUsers] = useState([])
    const [followcount, setFollowcount] = useState(0)

    const navigate=useNavigate()
    
    
    

    const {following,follow,unfollow}=useFollow()

    useEffect(()=>{
        const fetchData=async () => {
            const resUser=await axios.get("http://localhost:3000/auth/get-me",{
                withCredentials:true
            })
            console.log(resUser.data.username);
            
            
            setCurrentUser(resUser.data.user)
            
        }
        fetchData()
    
    },[])

    useEffect(()=>{
        const fetchUsers=async () => {
            const resUsers =await axios.get("http://localhost:3000/user/all",{
                withCredentials:true
            })
            console.log(resUsers.data);
            
            setUsers(resUsers.data.users)
        }
        fetchUsers()
    },[])

    if(!currentUser)return <p>Loading...</p>
    const followingUsers=allUsers.filter(user=>following?.includes(user.username))
    console.log(followingUsers);

    const suggestedUsers=allUsers.filter(user=>!following?.includes(user.username) && user.username!==currentUser.username)
    
  return (
    <div className="min-h-screen bg-[#333] p-6">
      
      <nav className='flex justify-between'>
        <p className='font-bold text-2xl'><RiInstagramLine />Insta</p>
        <button className='bg-amber-700 rounded-xl p-2 active:scale-95' onClick={()=>{navigate('/')}}>HomePage</button>
      </nav>
      <div className="bg-[#222] rounded-2xl shadow-md p-6 flex items-center gap-6 mt-3">
        <img
          src={currentUser.profileImage}
          alt="profile"
          className="w-20 h-20 rounded-full object-cover"
        />

        <div>
          <h2 className="text-2xl font-bold">{currentUser.username}</h2>
          <div className="flex gap-4 mt-2 text-white">
            <span>Following: {following.length}</span>
            <span>Users: {allUsers.length}</span>
          </div>
        </div>
      </div>

      
      <div className="grid md:grid-cols-2 gap-6 mt-6">

        
        <div className="bg-[#333] rounded-2xl shadow-md p-4">
          <h3 className="text-lg font-semibold mb-4">Following</h3>

          {followingUsers.length === 0 ? (
            <p className="text-white">You are not following anyone</p>
          ) : (
            followingUsers.map((user) => (
              <div
                key={user.username}
                className="flex items-center justify-between mb-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={user.profileImage}
                    className="w-10 h-10 rounded-full"
                  />
                  <span className="font-medium">{user.username}</span>
                </div>

                <button
                  onClick={() => unfollow(user.username)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
                >
                  Unfollow
                </button>
              </div>
            ))
          )}
        </div>

        
        <div className="bg-[#333]rounded-2xl shadow-md p-4">
          <h3 className="text-lg font-semibold mb-4">Suggested Users</h3>

          {suggestedUsers.length === 0 ? (
            <p className="text-white">No suggestions available</p>
          ) : (
            suggestedUsers.map((user) => (
              <div
                key={user.username}
                className="flex items-center justify-between mb-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={user.profileImage || "https://via.placeholder.com/40"}
                    className="w-10 h-10 rounded-full"
                  />
                  <span className="font-medium">{user.username}</span>
                </div>

                <button
                  onClick={() => follow(user.username)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600"
                >
                  Follow
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
