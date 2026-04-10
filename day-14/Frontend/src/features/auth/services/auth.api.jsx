import axios from "axios";

const api=axios.create({
    baseURL:"http://localhost:3000/auth",
    withCredentials: true
})

export async function register(username,email,password) {
    try {
        const res=await api.post("/register", {
            username,
            email,
            password
        })
        return res.data;
    } catch (error) {
        throw new error("Registration failed");
        
    }
}
export async function login(username,password) {
    try {
        const res=await api.post("/login",{
            username,
            password
        })
        return res.data;
    } catch (error) {
        throw new error("Login failed");
        
    }
}
export async function getme(username,profileImage,bio) {
    try {
        const res=await api.get("/get-me",{
            username,
            profileImage,
            bio
        })
        return res.data;
    } catch (error) {
        throw new error("Failed to fetch user data");
    }
}
