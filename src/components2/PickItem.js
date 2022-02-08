import "../styles/pick_item.scss";
import {useSelector,useDispatch} from "react-redux";
import {selectTimeZone,selectLeagues,selectSports} from "../features/counterSlice";
const moment=require("moment-timezone");


const PickItem=({pick,date})=>{
    const {team_picked,pickdata}=pick;
    const tz=useSelector(selectTimeZone);
    const sports=useSelector(selectSports);
    const leagues=useSelector(selectLeagues);

    const pick_date=moment.tz(date*1000,tz).format("ll")
    const pick_league=pick.league;
    const pick_sport=pick.sport;
    
    const league_name=leagues.filter((item)=>{
        return item.id==pick_league;
    })[0].name;

    const sport_name=sports.filter((item)=>{
        return item.id==pick_sport;
    })[0].name;

    const type_pick=pick.type_pick;
    let str_type_pick="";
    let odd="";
    const new_pick_data=pickdata.split(",")

    let s_team_away="";
    let s_team_home="";

    if(type_pick=="1"){
        str_type_pick="ML";
        if(team_picked=="1"){
            odd=new_pick_data[0];
            s_team_away="selected";
        }else{
            odd=new_pick_data[1];
            s_team_home="selected";
        }
    }else if(type_pick=="2"){
        str_type_pick="SPREAD";
        if(team_picked=="1"){
            odd=new_pick_data[2];
            s_team_away="selected"
        }else{
            odd=new_pick_data[3];
            s_team_home="selected"
        }
    }else{
        
        str_type_pick="Total"
        if(team_picked=="1"){
            str_type_pick="Over"
        }else{
            str_type_pick="Under";
        }
        odd="Total="+new_pick_data[6];
    }
    

    console.log("pick daa ",new_pick_data)

    
    

    

    return (
        <div className="pick_item">
            <div className="top">
                <div>
                    <p>date</p>
                    <p>{pick_date}</p>
                </div>
                <div>
                    <p>{sport_name}</p>
                    <p>Game</p>
                </div>
                <div>
                    <p className={s_team_away}>{pick.teams[0]}</p>
                    <p className={s_team_home}>{pick.teams[1]}</p>
                </div>
            </div>
            <div className="bottom">
                <div>
                    <p>{str_type_pick}</p>
                </div>
                <div>
                    <p>{league_name}</p>
                </div>
                <div>
                    {odd}
                </div>
            </div>
        </div>
    )
}

export default PickItem;