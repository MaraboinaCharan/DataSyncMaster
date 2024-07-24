import axios from "axios";
export const request=async(method,url,data)=>{
    try{
        const res=await axios({method,url:`http://192.168.220.106:8084/${url}`,data})
        // console.log(res.data)
        console.log(res,"a response")
        return res.data;

    }
    catch(error){
        console.log(error)
    }
}
