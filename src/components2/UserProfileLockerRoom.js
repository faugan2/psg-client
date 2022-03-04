import "../styles/user_profile_locker_room.scss";
import {useState,useEffect} from "react";
import {useSelector} from "react-redux";
import {selectTournaments,selectUserProfile,selectUsers,selectPicks} from "../features/counterSlice";
import LockerRoomItem from "./LockerRoomItem";

const UserProfileLockerRoom=({nb_matches_picks})=>{
    const t=useSelector(selectTournaments);
    const email=useSelector(selectUserProfile);
    const users=useSelector(selectUsers);
    const picks=useSelector(selectPicks);

    const [challenge_type,set_challenge_type]=useState(0);
    const [data,set_data]=useState([]);
    const [wins,set_wins]=useState(0);
    const [loses,set_loses]=useState(0);
    const [ties,set_ties]=useState(0);

    

    useEffect(()=>{
        const res=t.filter((item)=>{
            const new_type=challenge_type+2;
            const key=item.key;
            
            const res2=picks.filter((pick)=>{
                return pick.id_challenge==key;
            })
            
            let i_have_made_picks=false;
            if(res2.length>0){
                for(var i=0;i<res2.length; i++){
                    const user=res2[i].user;
                    if(user==email){
                        console.log("found in ",key)
                        i_have_made_picks=true;
                    }
                }
            }

            return item.parent==false && 
                item.winners!=undefined && 
                item.type==new_type && 
                i_have_made_picks==true
            ;
            
        })
        set_data(res);
        let ws=0;
        let ls=0;
        let ts=0;
        for(var i=0; i<res.length; i++){
            const game=res[i];
            const winners=game.winners;
            const wins=game.wins;
            const res_winners=winners.filter((item)=>{
                return item.user==email;
            })
            if(res_winners.length>0){
                if(winners.length==wins.length){
                    ts++;
                }else{
                    ws++;
                }
               
            }else{
                ls++;
            }

        }
        set_wins(ws);
        set_loses(ls);
        set_ties(ts);
    },[t,challenge_type])

    const set_type=(index)=>{
        const btns=document.querySelectorAll(".types>button");
        for(var i=0; i<btns.length; i++){
            btns[i].classList.remove("active");
        }
        btns[index].classList.add("active");
        set_challenge_type(index);
    }
    return(
        <div className="user_profile_locker_room">
            <div className="top">
               <div className="types">
                    <button className="active" onClick={set_type.bind(this,0)}>Heads Up</button>
                    <button  onClick={set_type.bind(this,1)}>Sports Booth</button>
                    <button  onClick={set_type.bind(this,2)}>Tournament</button>
               </div>
               <div className="stats">
                   <button>
                       <p>{wins}</p>
                       <p>Wins</p>
                   </button>
                   <button>
                       <p>{loses}</p>
                       <p>Loses</p>
                   </button>
                   <button>
                       <p>{ties}</p>
                       <p>Ties</p>
                   </button>
               </div>
            </div>

            <div className="content">
                {
                    data.length==0 && 
                    <div className="info">
                        <p>No data found</p>
                    </div>
                }

                {
                    data.length>0 && 
                    <div className="challenges">
                        {
                            data.map((item)=>{
                                return(
                                    <LockerRoomItem item={item} key={item.key} />
                                );
                            })
                        }
                    </div>
                }
            </div>
        </div>
    );
}
export default UserProfileLockerRoom;