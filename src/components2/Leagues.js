import { useSelector,useDispatch } from "react-redux";
import "../styles/leagues.scss";
import League from "./League";
import {selectLeagues,selectSports,setSport} from "../features/counterSlice";
import {useEffect, useState} from "react";
import {auth, db} from "../firebase_file";
import {useHistory} from "react-router-dom";
import FavoriteGames from "./FavoriteGames";
import QuickPlay from "./QuickPlay";

const Leagues=()=>{
    const l=useSelector(selectLeagues);
    const s=useSelector(selectSports);

    const [leagues,set_leagues]=useState([]);
    const [username,set_username]=useState("");

    const dispatch=useDispatch();
    const history=useHistory();

    useEffect(()=>{
        const res=s.filter((item)=>{
            return item.view==true;
        })
        set_leagues(res);
       

    },[s]);

    const go_to_games=(sport)=>{
        //console.log(sport);
        dispatch(setSport(sport));
        history.push("/games");
    }

    useEffect(()=>{
        if(auth.currentUser==null){
            history.replace("/");
            return;
        }
        set_username(auth?.currentUser?.displayName);
    },[auth])

    const go_to_invites=(e)=>{
        e.stopPropagation();
        //console.log("going to invites")
    }

    const go_to_messages=(e)=>{
        e.stopPropagation();
        //console.log("going to messages");
    }
    return (
        <div className="container">
            
       

        <QuickPlay />

        

        <div className="favorite_leagues" style={{display:"none"}}>
            <div className="head">
                <div></div>
                <div>Favorites Games</div>
                <div></div>
            </div>

            <FavoriteGames />
        </div>
        </div>
    )
}

export default Leagues;