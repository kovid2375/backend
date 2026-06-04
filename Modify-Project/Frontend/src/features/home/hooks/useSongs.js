import{getSong} from '../service/song.api'
import { useContext,  } from 'react'
import { SongContext } from '../song.context'

export const useSongs=()=>{
    const context=useContext(SongContext)
    const {setSong,loading,setLoading,song,setAutoPlayRequest}=context

    async function handelGetSong(mood){
        const normalizedMood=mood?.toString().trim().toLowerCase()
        if(!normalizedMood) return

        setLoading(true)
        try{
            const data=await getSong({mood:normalizedMood})
            if(data.song){
                setSong(data.song)
                setAutoPlayRequest((request) => request + 1)
            }
        }catch(error){
            console.error("Error fetching song:",error)
        }finally{
            setLoading(false)
        }
    }
    return({loading,song,handelGetSong})
}
