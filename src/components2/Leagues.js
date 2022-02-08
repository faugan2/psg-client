import { useSelector,useDispatch } from "react-redux";
import "../styles/leagues.scss";
import League from "./League";
import {selectLeagues,selectSports,setSport} from "../features/counterSlice";
import {useEffect, useState} from "react";
import {auth, db} from "../firebase_file";
import {useHistory} from "react-router-dom";
import FavoriteGames from "./FavoriteGames";

const Leagues=()=>{
    const l=useSelector(selectLeagues);
    const s=useSelector(selectSports);
    const [leagues,set_leagues]=useState([]);

    const dispatch=useDispatch();
    const history=useHistory();

    useEffect(()=>{
        const res=s.filter((item)=>{
            return item.view==true;
        })
        set_leagues(res);
       

    },[s]);

    const go_to_games=(sport)=>{
        console.log(sport);
        dispatch(setSport(sport));
        history.push("/games");
    }

    useEffect(()=>{
        if(auth.currentUser==null){
            history.replace("/");
        }
    },[auth])
    return (
        <div className="container">
            <h1>Hello, {auth?.currentUser.displayName}</h1>
            <p>Which game do you want to play in?</p>
        <div className="leagues">
            {
                leagues.map((league)=>{
                    return(
                        <League league={league} key={league.key} click={go_to_games.bind(this,league)} />
                    );
                })
            }
            
        </div>

        <div className="favorite_leagues">
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