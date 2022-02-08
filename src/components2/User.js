import "../styles/user.scss";
import {auth, db} from "../firebase_file";
import {useEffect, useState} from "react"

const User=({user,click,index})=>{
    const [username,set_username]=useState(user?.username);

    useEffect(()=>{
        if(auth?.currentUser.email==user?.email){
            set_username("Me");
        }
    },[auth])
    return(
        <div className={`user ${index==0?"active":""}`} onClick={e=>click(e,user,index)}>
           <img src={user.photo} />
           <p>{username}</p>
        </div>
    );
}

export default User;