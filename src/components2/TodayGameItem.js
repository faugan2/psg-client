import "../styles/today_game_item.scss";
import {basketball,
    baseball,overwatch,
    league_of_legend,
    ncaaf,ufc,ncaab,csgo,
    dota2,
    football,
    hockey,
    counter_strike,
    get_image,
    } from "./data";



const moment=require("moment-timezone");

const TodayGameItem=({item,show_scores,games,show})=>{
   
    const {id_game,type_pick,team_picked,pickdata,league}=item;
    let pick_data=pickdata.split(",");
    ////console.log("scores",show_scores);
    //console.log(id_game,type_pick,show)

    let str_type_pick="";
    let odds="";
    let a_selected="";
    let h_selected="";
    let a_score="-";
    let h_score="-";

    if(show_scores==true){
        const res=games.filter((item)=>{
            return item.key==id_game;
        })
        if(res.length>0){
            a_score=res[0].away_score;
            h_score=res[0].home_score;
            if(a_score==""){
                a_score="-";
            }
            if(h_score==""){
                h_score="-";
            }
        }
    }


    if(type_pick==1){
        str_type_pick="ML";
        if(team_picked==1){
            odds=pick_data[0];
            a_selected="active"
        }else{
            odds=pick_data[1]
            h_selected="active"
        }
    }else if(type_pick==2){
        str_type_pick="Spread"
        if(team_picked==1){
            odds=pick_data[2];
            a_selected="active"
        }else{
            odds=pick_data[3]
            h_selected="active"
        }
    }else if(type_pick==3){
        
        if(team_picked==1){
            str_type_pick="Over"
        }else{
            str_type_pick="Under"
        }
        odds="T="+pick_data[6];
    }
    const str_date=moment(item.date*1000).format("ll");
    return(
        <div className={`today_game_item ${show==true?"do_not_show":""}`}>
            {league==9 && <img src={baseball} />}
            {league==11 && <img src={overwatch} />}
            {league==8 && <img src={league_of_legend} />}
            {league==1 && <img src={ncaaf} />}
            {league==12 && <img src={ufc} />}
            {league==4 && <img src={ncaab} />}
            {league==10 && <img src={csgo} />}
            {league==7 && <img src={dota2} />}
            {league==2 && <img src={football} />}
            {league==3 && <img src={basketball} />}
            {league==5 && <img src={hockey} />}
            {league==6 && <img src={counter_strike} />}
            <div className="teams">
                <p></p>
                <p className={a_selected}>{item.teams[0]}</p>
                <p className={h_selected}>{item.teams[1]}</p>
            </div>
            {
                show_scores==true && 
                <div className="scores">
                    <p>Scores</p>
                    <p>{a_score}</p>
                    <p>{h_score}</p>
                </div>
            }
            <div className="odds">
                
                <p>{str_type_pick}</p>
                <p>{odds}</p>
                <p>-</p>
            </div>
            <div className="date">
                
                <p>Date</p>
                <p>{str_date}</p>
                <p>-</p>
            </div>
        </div>
    )
}
export default TodayGameItem;