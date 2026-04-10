import { useContext } from "react";
import { FollowContext } from "../follow.context";

const useFollow =()=>{
    return useContext(FollowContext)
}
export default useFollow