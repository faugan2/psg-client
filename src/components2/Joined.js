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
import JoinedConfiguration from "./JoinedConfiguration";
import SettingsIcon from '@material-ui/icons/Settings';
import HeaderBottomSheet from "./HeaderBottomSheet";
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import JoinedInviteUser from "./JoinedInviteUser";
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
    const [results,set_results]=useState(false);
    const [id_ch,set_id_ch]=useState(null);

    useEffect(()=>{
        if(id_challenge==null) return;
        set_id_ch(id_challenge);
    },[id_challenge])


    useEffect(()=>{
        if(id_ch==null) return;
        if(tournaments==null || tournaments.length==0) return;

        const res=tournaments.filter((item)=>{
            return item.key==id_ch;
        })

        if(res.length>0){
            set_challenge(res[0]);
        }

        const res2=picks.filter((item)=>{
            return item.id_challenge==id_ch;
        })

        //get list of users
        const res3=res2.map((item)=>{
            return item.user;
        })

        const res_users=u.filter((item)=>{
            return res3.indexOf(item.email)>=0;
        })
        
        set_users(res_users);

        //console.log("the challenge is ",challenge);
        if(challenge==null){
            return;
        }
        if(challenge?.winners==undefined){
            set_results(false)
        }else{
            set_results(true);
        }
        

    },[id_ch,tournaments,picks])

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
                {(page==2 && results==false) && <JoinedConfiguration />}
                {(page==2 && results==true) && <JoinedConfiguration />}
                {(page==3) && <JoinedInviteUser click={change_page} />}

            <div className="joined_footer">
           

            <button
                onClick={change_page.bind(this,1)}
                className="joined_action active"
            >
                <PeopleOutlineIcon style={{fontSize:"1.2rem"}} />
                Players
            </button>

            <button
                onClick={change_page.bind(this,2)}
                className="joined_action"
            >
                {results==false && <SettingsIcon style={{fontSize:"1.2rem"}}/>}
                {results==true && <SettingsIcon style={{fontSize:"1.2rem"}}/>}
                   
                {results==false? "Settings":"Results"}
            </button>

            <button
                onClick={change_page.bind(this,3)}
                className="joined_action"
            >
                <PersonAddIcon style={{fontSize:"1.2rem"}}/>
                Invites
            </button>

           
            </div>

            <HeaderBottomSheet title="Joined">
                <button 
                    className="joined_footer_close_btn"
                    onClick={click}
                >
                    <CloseIcon style={{fontSize:"1.2rem"}} />
                </button>
            </HeaderBottomSheet>
            
        </div>
    )
}

export default Joined;