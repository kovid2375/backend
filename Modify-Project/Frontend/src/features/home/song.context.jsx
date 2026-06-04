import {createContext} from "react"
import { useState } from "react"
export const SongContext = createContext()

export const SongContextProvider=({children})=>{
    const[song,setSong]=useState({
    "url": "https://ik.imagekit.io/9q5a9vxr1p/backend-start/songs/Badshah_-_Daaku__Official_Music_Video___Sharvi_Yadav___Hiten__EK_THA_RAJA_3xtLCF8qp.mp3",
    "title": "Badshah - Daaku (Official Music Video)  Sharvi Yadav   Hiten  EK THA RAJA",
    "mood": "happy",
    "__v": 0
})
const[loading,setLoading]=useState(false)
const[autoPlayRequest,setAutoPlayRequest]=useState(0)
return(
    <SongContext.Provider value={{song,setSong,loading,setLoading,autoPlayRequest,setAutoPlayRequest}}>
        {children}
    </SongContext.Provider>
)
}
