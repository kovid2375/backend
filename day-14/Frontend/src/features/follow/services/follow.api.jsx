import axios from 'axios'
const api = axios.create({
    baseURL:"http://localhost:3000",
    withCredentials:true
})

export const followUserApi=(username)=>{
    return api.post("/user/follow/"+username)
}

export const unfollowUserApi=(username)=>{
    return api.post("/user/unfollow/"+username)
}