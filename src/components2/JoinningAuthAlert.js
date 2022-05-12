import React from 'react'
import "../styles/joinning_auth_alert.scss";
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import {useHistory} from "react-router-dom";
import { BottomSheet } from 'react-spring-bottom-sheet'
import Login from './modals/Login';
import {useState,useEffect} from "react";

export default function JoinningAuthAlert() {
    const [open_login,set_open_login]=useState(false);

    const history=useHistory();
    const go_to_login=()=>{
        set_open_login(true);
    }
  return (
    <div className="joinning_auth_alert">
       <div>
           <PermIdentityIcon  />
           <p>Sign Up for an account</p>
           <button onClick={go_to_login}>Sign up</button>
       </div>

       <BottomSheet open={open_login}>
           <Login close={()=>{set_open_login(false)}} />
       </BottomSheet>
    </div>
  )
}
