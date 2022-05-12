import baseball from "./img/baseball.png";
import basketball from "./img/basketball.png";
import hockey from "./img/hockey.png";
import football from "./img/football.png";
import counter_strike from "./img/counter_strike.png";
import csgo from "./img/csgo.png";
import dota2 from "./img/dota2.png";
import league_of_legend from "./img/league_of_legend.png";
import ncaab from "./img/ncaab.png";
import ncaaf from "./img/ncaaf.png";
import overwatch from "./img/overwatch.png";
import ufc from "./img/ufc.png";
import {db} from "../firebase_file";
import firebase from "firebase";
import {  toast } from 'react-toastify';

const user_stats=(user_email,all_stats)=>{
    let loses=0;
    let wins=0;
    let ties=0;
    let last_200="0-0";
    let last_10="0-0";
    let win_per=".000";
    let over_under="0-0";
    let streak=0;
    

    const res=all_stats.filter((item)=>{
        return item.user==user_email
    })

    console.log("the stats is ",res)
    if(res.length>0){
        
       loses=res[0].user_loses;
       wins=res[0].user_wins;
       ties=res[0].user_tie;
       let total=res[0].user_wins + res[0].user_loses;
       if(total>0){
           let per=wins/total;
           per=per.toFixed(3);
           per=(""+per).replace("0.",".");
           win_per=per;
       }
       over_under=res[0].user_wins_ou+"-"+res[0].user_loses_ou;

       //winning streak
       const res_streak=res[0].results_streak;
       for(var i=0; i<res_streak.length; i++){
           const str=parseInt(res_streak[i]);
            if(!isNaN(str)){
                if(str==0){
                    streak=0;
                }else{
                    streak+=1;
                }
            }
       }

       //last ten
       let streak_copy=res_streak.filter((item)=>{
           return !isNaN(parseInt(item))
       });
       console.log("str result filter is ",streak_copy)
       streak_copy.reverse();

       let last_ten_wins=0;
       let last_ten_loses=0;
       let res_last_ten=streak_copy;
       if(streak_copy.length>10){
        res_last_ten=streak_copy.slice(0,10);
       }
     
        for(var i=0; i<res_last_ten.length; i++){
            const el=parseInt(res_last_ten[i]);
            if(!isNaN(el)){
                if(el==0){
                    last_ten_loses++;
                }else{
                    last_ten_wins++;
                }
            }
        }
       

       last_10=`${last_ten_wins}-${last_ten_loses}`;

       // last 200

       let last_200_wins=0;
       let last_200_loses=0;
       let res_last_200=streak_copy;
       if(res_last_200.length>=200){
        res_last_200=streak_copy.slice(0,200);
       }
       
      
        for(var i=0; i<res_last_200.length; i++){
            const el=parseInt(res_last_200[i]);
            if(!isNaN(el)){
                if(el==0){
                    last_200_loses++;
                }else{
                    last_200_wins++;
                }
            }
        }
       

       last_10=`${last_ten_wins}-${last_ten_loses}`;
       last_200=`${last_200_wins}-${last_200_loses}`;

       
    }

    return {wins,loses,ties,last_200,win_per,over_under,streak,last_10};
}

const user_matches_picks=(user,picks)=>{
    let total_matches=0;
    let total_picks=0;

    let total_heads_up=0;
    let total_sports_booth=0;
    let total_tournament=0;

    total_heads_up=picks.filter((item)=>{
        return item.user==user && item.type_challenge=="2"
    });

    total_sports_booth=picks.filter((item)=>{
        return item.user==user && item.type_challenge=="3"
    });

    total_tournament=picks.filter((item)=>{
        return item.user==user && item.type_challenge=="4"
    });



    const res=picks.filter((item)=>{
        return item.user==user && item.type_challenge!="4";
    })

    

    total_matches=res.length;
    const deja=[];
    for(var i=0; i<res.length; i++){
        const pick=res[i].picks;
        for(var j=0; j<pick.length; j++){
            const p=pick[j];
            const id_game=p.id_game;
            const type_pick=p.type_pick;
            const key=`${id_game}_${type_pick}`;
            if(deja.indexOf(key)<0){
                deja.push(key);
            }
        }
    }
    total_picks=deja.length;

    return {total_matches,total_picks,total_heads_up,total_sports_booth,total_tournament};
}

const user_coins=(user,transactions)=>{
    let total_coins=50;
    const res=transactions.filter((item)=>{
        return item.user==user;
    })


    const res2=res.map((item)=>{
        const entry=parseFloat(item.entry);
        total_coins+=entry
    })
   return total_coins;
}


const create_all_main_challenges=(tournaments)=>{
    db.collection("psg_challenges").where("parent","==",true).get().then((snap)=>{
        const mains=[];
        snap.docs.map((doc)=>{
            const key=doc.id;
            const data=doc.data();
            //league,type,mode,entry,number_game

            const league=data.league;
            const type=data.type;
            const entry=data.entry;
            const number_game=data.number_game;
            const mode=data.mode;
            const line=league+"-"+type+"-"+entry+"-"+number_game+"-"+mode;

            if(mains.indexOf(line)<0){
                mains.push(line);
            }
          
        })
       // console.log("mains",mains);

        mains.map(async (line,i)=>{
            const [league,type,entry,number_game,mode]=line.split("-");
            console.log(tournaments);
           const res=tournaments.filter((item)=>{
               return item.league==league && 
               item.type==type &&
               item.entry==entry && 
               item.mode==mode &&
               item.number_game==number_game && 
               item.parent==true
           })
           
           if(res.length>0){
               let challenge={...res[0]};
               delete challenge.key;
               delete challenge.winners;
               delete challenge.wins;
               delete challenge.challenge_results;

               challenge.parent=false;
               challenge.date=firebase.firestore.FieldValue.serverTimestamp();
               

               await create_challenge(i,challenge);
               /*(async ()=>{
                console.log("creating f or",i)
                await db.collection("psg_challenges").add(challenge);
                console.log("done for ",i)
               })()*/

               
              
               
                /*db.collection("psg_challenges").add(challenge).then(()=>{
                    console.log("created for ",i,line)
                });*/
               
           }
        })
    })
}

const create_challenge=async (i,challenge)=>{
   await db.collection("psg_challenges").add(challenge);
   console.log("creating for ",i)
}


const set_toast=(msg,type)=>{
    if(type==0){
        toast.error(msg, {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }else if(type==1){
        toast.success(msg, {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }
    
}


export {
    baseball,
    basketball,
    hockey,
    football,
    counter_strike,
    csgo,
    dota2,
    league_of_legend,
    ncaab,
    ncaaf,
    overwatch,
    ufc,
    user_stats,
    user_matches_picks,
    user_coins,
    create_all_main_challenges,
    set_toast
};