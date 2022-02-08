import "../styles/user_picks.scss";
import {useEffect, useState} from "react";
import PickItem from "./PickItem";

const UserPick=({user_picks})=>{
    const [picks,set_picks]=useState([]);
    const [date,set_date]=useState("");

   

    useEffect(()=>{
        if(user_picks==null) return;
        set_picks(user_picks.picks);
        set_date(user_picks.date)
    },[user_picks])
    return(
        <div className="user_picks">
            {
                picks.map((item,i)=>{
                    return <PickItem key={i} pick={item} date={date} />
                }) 
            }
        </div>
    );
}

export default UserPick;