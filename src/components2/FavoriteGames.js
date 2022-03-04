import "../styles/favorite_games.scss";
import {useState,useEffect} from "react";
import {useSelector,useDispatch} from "react-redux";
import {selectPicks,selectTournaments,selectLeagues,selectSports,setSport,setGameDate,setLine} from "../features/counterSlice";
import {auth} from "../firebase_file";
import FavoriteItem from "./FavoriteItem";
import {useHistory} from "react-router-dom";

const FavoriteGames=()=>{
    const picks=useSelector(selectPicks);
    const t=useSelector(selectTournaments);
    const l=useSelector(selectLeagues);
    const s=useSelector(selectSports);

    const dispatch=useDispatch();
    const history=useHistory();

    const me=auth?.currentUser;

    const [favorites,set_favorites]=useState([]);

    useEffect(()=>{
        if(picks==null || picks.length==0) return;
        if(t==null || t.length==0) return;

        const res=picks.filter((item)=>{
            return item.user==me?.email;
        })
        
        const challenges=res.map((item)=>{
            return item.id_challenge;
        })

        

        
        const res2=t.filter((item)=>{
            return challenges.indexOf(item.key)>=0;
        })

        //entry,number_game,sport,league,type,mode
        const res3=res2.map((item)=>{
            const {entry,league,sport,number_game,type,mode}=item;
            return {entry,league,sport,number_game,type,mode};
        })

        const fav=[];
        res3.map((item)=>{
            const r=fav.filter((item2)=>{
                return item2.entry==item.entry && 
                item2.league==item.league && 
                item2.sport==item.sport && 
                item2.number_game==item.number_game && 
                item2.type==item.type && 
                item2.mode==item.mode
            })
            if(r.length==0){
                fav.push(item);
            }
        })

        const res4=fav.map((item)=>{
            const item_league=item.league;
            const item_sport=item.sport;

            const league_name=l.filter((i)=>{
                return i.id==item_league;
            })[0]?.name;
            
            const sport_name=s.filter((i)=>{
                return i.id==item_sport;
            })[0]?.name;
            
            return {...item,league_name,sport_name};

        })
        
        
       
        const res5=res4.map((item)=>{
            const entry=item.entry;
            const league=item.league;
            const type=item.type;
            const mode=item.mode;
            const number_game=item.number_game;

           // console.log({entry,league,type,mode,number_game});
            const res_ch=challenges.map((id)=>{
                const ch_content=t.filter((j)=>{
                    return j.key==id;
                })[0];
                //console.log(ch_content);
                if(ch_content==undefined) return undefined;
                
                if(ch_content?.entry==entry && 
                    ch_content?.league==league && 
                    ch_content?.type==type && 
                    ch_content?.mode==mode && 
                    ch_content?.number_game==number_game){
                    return id;
                }
            })

            const new_res_ch=res_ch.filter((i)=>{
                return i!=undefined;
            })
            return {...item,total:new_res_ch.length};
        })

        

        res5.sort((a,b)=>(a.total <b.total) ? 1:-1);
        set_favorites(res5);

        res5.map((item)=>{
            console.log(item);
        })
        /*if(res4.length>5){
            const res5=res4.slice(0,res4.length);
            set_favorites(res5);
        }else{
            set_favorites(res4);
        }*/
        
        
    },[picks,t])


    const go_to_games=(favorite)=>{
        const res=s.filter((item)=>{
            return item.id==favorite.sport;
        })

        if(res.length>0){
            dispatch(setSport(res[0]))
            
        }

        const res2=t.filter((item)=>{
            return item.type==favorite.type && 
            item.mode==favorite.mode && 
            item.entry==favorite.entry && 
            item.number_game==favorite.number_game && 
            item.league==favorite.league
            
        })
        console.log("the res is ",res2);
        if(res2.length>0){
            dispatch(setLine(res2[0]));
        }
        dispatch(setGameDate(new Date()));
        
        history.push("/game-lines");
        
    }
    return(
        <div className="favorite_games">
            {
                favorites.length==0 && <div className="info">
                        <p>You have no favorite games yet</p>
                    </div>
            }

            {
                favorites.length>0 && 
                <div className="favorite_liste">
                        {
                            favorites.map((item,i)=>{
                                return <FavoriteItem key={i} favorite={item} click={go_to_games.bind(this,item)} />
                            })
                        }
                </div>
            }
        </div>
    );
}

export default FavoriteGames;