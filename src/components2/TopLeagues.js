import "../styles/top_leagues.scss";
import HorizontalScroll from 'react-horizontal-scrolling'
import {useState,useEffect} from "react";
import { useSelector,useDispatch } from "react-redux";
import {selectSports,selectLeagues,setSport, setLeague,setLeaguePageOptions,selectGameDate, selectLeaguePageOptions} from "../features/counterSlice";
import {useHistory} from "react-router-dom";
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

import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu"

const TopLeagues=()=>{
    const sports=useSelector(selectSports);
    const leagues=useSelector(selectLeagues);
    const game_date=useSelector(selectGameDate);
    const game_options=useSelector(selectLeaguePageOptions);
   
    const history=useHistory();
    const dispatch=useDispatch();

    const [data,set_data]=useState([]);

    

    useEffect(()=>{
        if(sports==null || sports.length==0) history.replace("/");
        if(leagues==null || leagues.length==0) history.replace("/");

        const res=sports.filter((item)=>{
            return item.view==true;
        })
       
        const res2=res.map((item)=>{

            const id=item.id;
            const res2_1=leagues.filter((i)=>{
                return i.id_sport==id;
            })
           
            for(var i=0; i<res2_1.length; i++){
                return {...res2_1[i]}
            }
        })
        //console.log("the result is= ",res2)
        set_data(res2)

        set_data(leagues)

    },[sports,leagues]);

    const league_clicked=(id)=>{
      
       const res=leagues.filter((item)=>{
           return item.id==id;
       })[0];

       const id_sport=res.id_sport;
       const res2=sports.filter((item)=>{
           return item.id==id_sport;
       })[0];

       //console.log(res2);

       const options={id_sport,id_league:id,entry:1,type:1,mode:1,date:[game_date]};
       dispatch(setLeaguePageOptions(options));
       dispatch(setSport(res2));
       dispatch(setLeague(res));
       history.push("/league-page");

      
    }

    return(
        <div className="top_leagues">
            <ScrollMenu>
                {
                    data.map((item)=>{
                        return(
                            <button key={item.id} onClick={league_clicked.bind(this,item.id)}>
                                {item.id==9 && <img src={baseball} />}
                                {item.id==11 && <img src={overwatch} />}
                                {item.id==8 && <img src={league_of_legend} />}
                                {item.id==1 && <img src={ncaaf} />}
                                {item.id==12 && <img src={ufc} />}
                                {item.id==4 && <img src={ncaab} />}
                                {item.id==10 && <img src={csgo} />}
                                {item.id==7 && <img src={dota2} />}
                                {item.id==2 && <img src={football} />}
                                {item.id==3 && <img src={basketball} />}
                                {item.id==5 && <img src={hockey} />}
                                {item.id==6 && <img src={counter_strike} />}
                               
                                <p>{item.name}</p>
                                
                            </button>
                        )
                    })
                }
            </ScrollMenu>
        </div>
    )
}
export default TopLeagues;