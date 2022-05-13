import "../styles/live_item.scss";
import {baseball,basketball,hockey,football} from "../components2/data";
import {useState,useEffect} from "react";
import {useSelector,useDispatch} from "react-redux";
import {selectTournaments,selectLeagues,selectPicks} from "../features/counterSlice";
import {useTransition,animated} from "react-spring";

const LiveItem=({pick,click})=>{

  const {id_challenge}=pick;
  //console.log("the id challenge is ",id_challenge);

  const t=useSelector(selectTournaments);
  const leagues=useSelector(selectLeagues);
  const picks=useSelector(selectPicks);


  const [live,set_live]=useState(null);
  const [league_name,set_league_name]=useState("");
  const [entry,set_entry]=useState("");
  const [winning,set_winning]=useState("0");
  const [total_players,set_total_players]=useState("");
  const [players,set_players]=useState("");
  
  useEffect(()=>{
    if(t==null || t.length==0) return;
    const res=t.filter((item)=>{
        return item.key==id_challenge;
    })
   
    if(res.length>0){
        set_live(res[0]);
    }
  },[t])

  useEffect(()=>{
    if(live==null || leagues==null ) return;


    const l=live.league;
    const res=leagues.filter((item)=>{
        return item.id==l;
    })
    if(res.length>0){
        set_league_name(res[0]?.name);
    }

    const fee=live.entry;
    if(fee=="0"){
        set_entry("Free");
        set_winning("0")
    }else{
        set_entry(fee);
    }
    
    const res2=picks.filter((item)=>{
        return item.id_challenge==id_challenge;
    })
    
    set_players(res2.length);

    if(live.type=="2"){
        set_total_players("2")
    }else if(live.type=="3"){
        set_total_players("10")
    }else{
        set_total_players("2+")
    }

  },[live,picks,leagues])

  useEffect(()=>{
    if(total_players=="" || entry=="" || live==null) return;
    let tp=total_players;
    tp=tp.replace("+","");
    tp=parseInt(tp);
    let e=live.entry
    
    e=parseInt(e);
    //console.log(tp,e)
    set_winning(tp*e);
  },[live,total_players,entry]);

  const [show,set_show]=useState([1]);
  const transition=useTransition(show,{
      from:{
          opacit:0,
          x:0,
          y:500,
          
      },
      enter:{
          opacity:1,
          x:0,
          y:0
      },
      leave:{}
  })


    return(

        transition((style,item)=>{
            if(item){
                return(
                    <animated.div className="live_item" 
                    style={style}
                    onClick={click.bind(this,id_challenge)}>
            <div className="top">
                {live?.sport==2 && <img src={basketball} />}
                {live?.sport==6 && <img src={baseball} />}
                {live?.sport==3 && <img src={hockey} />}
                {live?.sport==1 && <img src={football} />}
                <div>
                    <p>{live?.name}</p>
                    <p>{league_name}</p>
                </div>
            </div>
            <div className="bottom">
                <div>
                    <p>{live?.number_game}</p>
                    <p>#Game</p>
                </div>
                <div>
                    <p>{entry}</p>
                    <p>Entry</p>
                </div>
                <div>
                    <p>{winning}</p>
                    <p>Winning</p>
                </div>
                <div>
                    <p>{players}/{total_players}</p>
                    <p>Players</p>
                </div>
            </div>
        </animated.div>
                )
            }
        })
        
    )
}

export default LiveItem;