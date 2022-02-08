import "../styles/joined.scss";
import HorizontalScroll from 'react-horizontal-scrolling'
import {useSelector,useDispatch} from "react-redux";
import {selectViewChallenge,selectTournaments,selectPicks,selectUsers} from "../features/counterSlice";
import {useState,useEffect} from "react";
import User from "./User";
import UserPicks from "./UserPicks";
import CloseIcon from '@material-ui/icons/Close';
import ForumIcon from '@material-ui/icons/Forum';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import JoinedResults from "./JoinedResults";
import JoinedChat from "./JoinedChat";
const Joined=({click})=>{

    const id_challenge=useSelector(selectViewChallenge);
    const tournaments=useSelector(selectTournaments);
    const picks=useSelector(selectPicks);
    const u=useSelector(selectUsers);

    const [users,set_users]=useState([]);
    const [challenge,set_challenge]=useState(null);
    const [selected_user,set_selected_user]=useState(null);
    const [user_picks,set_user_picks]=useState(null);
    const [page,set_page]=useState(1);


    useEffect(()=>{
        if(id_challenge==null) return;
        if(tournaments==null || tournaments.length==0) return;

        const res=tournaments.filter((item)=>{
            return item.key==id_challenge;
        })

        if(res.length>0){
            set_challenge(res[0]);
        }

        const res2=picks.filter((item)=>{
            return item.id_challenge==id_challenge;
        })

        //get list of users
        const res3=res2.map((item)=>{
            return item.user;
        })

        const res_users=u.filter((item)=>{
            return res3.indexOf(item.email)>=0;
        })
        
        set_users(res_users);
        

    },[id_challenge,tournaments,picks])

    const user_selected=(e,user,index)=>{
        
        set_selected_user(user);
        const btns=document.querySelectorAll(".user");
        for(var i=0; i<btns.length; i++){
            btns[i].classList.remove("active");
        }
        btns[index].classList.add("active");
    }

    useEffect(()=>{
        if(selected_user==null) return;
        const email=selected_user.email;
        const res=picks?.filter((item)=>{
            return item.user==email && item.id_challenge==id_challenge;
        })

        if(res.length>0){
            
            set_user_picks(res[0]);
        }
        
    },[selected_user])

    useEffect(()=>{
        if(users.length>0){
            document.querySelectorAll(".user")[0]?.click();
        }
    },[users])

    const change_page=(index)=>{
        const btns=document.querySelectorAll(".joined_action");
        for(var i=0; i<btns.length; i++){
            btns[i].classList.remove("active");
        }
        btns[index-1].classList.add("active");
        set_page(index);
    }

    return(
        <div className="joined">
            {page==1 && <div className="top">
               <HorizontalScroll>
                   {users.map((user,i)=>{
                       return (
                           <User key={user.key} user={user} click={user_selected} index={i} />
                       )
                   })}
               </HorizontalScroll>
            </div>}
            
            {(page==1 && user_picks!=null) && <div className="bottom"><UserPicks user_picks={user_picks} /></div>}
                {(page==2) && <JoinedResults  />}
                {(page==3) && <JoinedChat  />}

            <div className="joined_footer">
            <button
                onClick={click}
            >
                <CloseIcon style={{fontSize:"1.2rem"}} />
            </button>

            <button
                onClick={change_page.bind(this,1)}
                className="joined_action active"
            >
                <PeopleOutlineIcon style={{fontSize:"1.2rem"}} />
                Users
            </button>

            <button
                onClick={change_page.bind(this,2)}
                className="joined_action"
            >
                <EqualizerIcon style={{fontSize:"1.2rem"}}/>
                Results
            </button>

            <button
                onClick={change_page.bind(this,3)}
                className="joined_action"
            >
                <ForumIcon style={{fontSize:"1.2rem"}}/>
                Chat
            </button>

           
            </div>
            
        </div>
    )
}

export default Joined;