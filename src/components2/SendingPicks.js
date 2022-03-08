import "../styles/sending_picks.scss";
import CircularProgress from '@material-ui/core/CircularProgress';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { useSelector } from "react-redux";
import { selectJoinSuccess } from "../features/counterSlice";
import {useState,useEffect} from "react";
const SendingPicks=()=>{
    const success=useSelector(selectJoinSuccess);


    return (
        <div className="sending_picks">
            {success==false && <p>Please wait...</p>}
            {success==false && <CircularProgress size={15} style={{color:"white"}}/>}
            {success==true && <CheckCircleOutlineIcon size={30} style={{color:"white",fontSize:"4rem"}}/>}
        </div>
    )
}

export default SendingPicks;