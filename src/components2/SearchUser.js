import "../styles/search_user.scss";
import StarBorderIcon from '@material-ui/icons/StarBorder';
import {useState,useEffect} from "react";
import {useSelector,useDispatch} from "react-redux";
import {selectUsersStats} from "../features/counterSlice";
import {user_stats} from "./data";
import {useTransition,animated} from "react-spring";


const SearchUser=({info,click})=>{
    const us=useSelector(selectUsersStats);
   const [l,set_l]=useState(0);
   const [w,set_w]=useState(0);
   const [t,set_t]=useState(0);
   const [wp,set_wp]=useState(".000");
   const [l200,set_l200]=useState("0-0");

   useEffect(()=>{
         const {wins,loses,ties,last_200,win_per}=user_stats(info?.email,us)
         set_w(wins);
         set_l(loses);
         set_t(ties);
         set_l200(last_200);
         set_wp(win_per);
         
     },[us]);

     const [show_user,set_show_user]=useState([1])
     const transition=useTransition(show_user,{
        from:{x:-10,y:0,opacity:0},
        enter:item=>async (next)=>{
            await next({x:10,y:0,opacity:1,delay:Math.round(Math.random()*200)});
            await next({x:0});
        },
        leave:{}
     })

    return(

        transition((style,item)=>{
            if(item){
                return(
                    <animated.div className="search_user" 
                    
                    onClick={click.bind(this,info?.email)}>
                    <div className="user_left">
                        <img src={info?.photo} />
                        <div>
                            <p>{info?.username}</p>
                            <p>{info?.status}</p>
                            <div>
                                <StarBorderIcon style={{fontSize:"1rem",color:"indianred"}}/>
                            </div>
                        </div>
                    </div>
                    <div className="user_right">
                            <button>
                                <p>{wp}</p>
                                <p>Win %</p>
                            </button>
                            <button>
                                <p>{l200}</p>
                                <p>Last 200</p>
                            </button>
                    </div>
                </animated.div>
                );
            }
        })
        
    );
}

export default SearchUser;