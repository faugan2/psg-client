import { useDispatch, useSelector } from "react-redux";
import { selectActiveTab, selectTournaments, setSport, 
    selectTab,setTab, setActiveTab, setPage,setHeaderTab,selectHeaderTab, selectUsers, 
    setSelectedPlayer, setScreenHeight, setHeaderHeight,setInvitedFriends,setFriendChallenged, selectSports
 } 
from "../features/counterSlice";
import { auth } from "../firebase_file";
import { useEffect, useState } from "react";
import Lobby from "../components/Lobby";
import Games from "../components/Games";
import Live from "../components/Live";
import Friends from "../components/Friends";
import Profile from "../components/Profile";
import { useHistory } from "react-router-dom";

import Nav from "../components/Nav";
import Top from "../components/Top";
import '@fontsource/roboto';

import Header from "../components/Header2";
import SwipeableViews from 'react-swipeable-views';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import DriveEtaIcon from '@material-ui/icons/DriveEta';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import { Avatar } from "@material-ui/core";
import SettingsIcon from '@material-ui/icons/Settings';
import Leagues from "../components2/Leagues";
import MainFooter from "../components2/MainFooter";
import Live2 from "../components2/Live";
import History2 from "../components2/History";
import LockerRoom2 from "../components2/LockerRoom";
import ForumIcon from '@material-ui/icons/Forum';
import Chat from "../components2/Chat"
import { BottomSheet } from 'react-spring-bottom-sheet'
import "../styles/main.scss";

const styles = {
    slide: {
      color: 'black',
      overflow: "auto",
      padding: "1rem"
      
    },
    slide1: {
     
    },
    slide2: {
      
    },
    slide3: {
      
    },
  };

const Main=()=>{
    
    const history=useHistory();
    const dispatch=useDispatch();
    const [h,setH]=useState(0);
    const [user,set_user]=useState(null);
    const [photo,setPhoto]=useState("foo.jpg");
    const u=useSelector(selectUsers);
    const s=useSelector(selectSports)

    const [page,set_page]=useState(1);
    const [open,set_open]=useState(false);

    const close_modal=()=>{
        set_open(false);
    }

    useEffect(()=>{
        if(s==null || s.length==0) {
            history.replace("/");
        }
    },[s])
   

    useEffect(()=>{
        //console.log("ok for this")
        const height=window.screen.height
        const header=document.querySelector("#header")?.clientHeight;
        const dif=height-header;
        setH(dif);

        const sc=document.querySelectorAll(".slide_content");
        sc.forEach((s)=>{
            s.style.height=dif+"px";
        })
    },[])

    useEffect(()=>{
        window.addEventListener('resize', handle_resize_window, true);
        return ()=>{
            //console.log("ok")
            window.removeEventListener("resize",handle_resize_window);
        }
    },[])

    const handle_resize_window=(event)=>{
        const height=window.screen.height
        dispatch(setScreenHeight(height));
        const header=document.querySelector("#header")?.clientHeight;
        const dif=height-header;
        dispatch(setHeaderHeight(header))
        setH(dif);
        //console.log("resize is now ",dif);
    }
    
    const tab_index=useSelector(selectTab);
    const [index,setIndex]=useState(0);

    useEffect(()=>{
        setIndex(tab_index);
    },[tab_index]);

    const handleChangeIndex=(index)=>{
        dispatch(setTab(index))
        setIndex(index);
    }

    const [games_drawer,set_games_Drawer]=useState(false);
    const onGames_drawer_closed=()=>{
        set_games_Drawer(!games_drawer);
    }

    useEffect(()=>{
        if(auth.currentUser==null){
            history.replace("/");
            return;
        }

        const email=auth?.currentUser?.email;
        //console.log(email);
        /*if(info.photo=="foo.jpg"){
            up=<Avatar onClick={handleClickOpen}>{info.username[0].toLowerCase() }</Avatar>;
        }else{
            up=<img src={info.photo}  onClick={handleClickOpen}/>
        }*/
    },[auth]);


    useEffect(()=>{
       
        if(auth?.currentUser==null){
            history.push("/");
            return;
        }
        const res=u.filter((user)=>{
            return user.email==auth?.currentUser.email;
        });
        if(res.length>0){
            set_user(res[0]);
            setPhoto(res[0].photo);
        }
    },[u]);

    const go_to_profile=()=>{
        if(auth?.currentUser==null){
            history.push("/");
            return;
        }
        const email=auth?.currentUser.email;
        const res=u.filter((user)=>{
           return user.email==email;
        })
    
        const user=res[0];
        dispatch(setSelectedPlayer(user));
        history.push("/profile");
    
    }


    const go_to_friends=()=>{
        history.push("start-game");
    }
	
	const create_new_challenge=()=>{
		dispatch(setInvitedFriends([]));
		dispatch(setFriendChallenged({}))
		history.push("/challenge-friend");
	}

  
    const change_page=(index)=>{
        set_page(index);
    }

    //console.log("here we go then h");

    useEffect(()=>{
        dispatch(setSport(null))
    },[])
    return(
<div  className="main">
<Header onGames_drawer_closed={onGames_drawer_closed} index={index} />
<SwipeableViews enableMouseEvents index={index} onChangeIndex={handleChangeIndex}>
    <div style={Object.assign({}, styles.slide, styles.slide1,{display:"flex",justifyContent:"center",})} className="slide" id="slide1">
        {/*<Games drawer={games_drawer} onClose={onGames_drawer_closed} />*/}
        
        {page==1 && <Leagues />}
        {page==2 && <Live2 />}
        {page==3 && <History2 />}
        {page==4 && <LockerRoom2 />}
    </div>
    <div style={Object.assign({}, styles.slide, styles.slide2,{height:h})} className="slide" id="slide2">
       <Live />
    </div>
    <div style={Object.assign({}, styles.slide, styles.slide3,{height:h})} className="slide" id="slide3">
        <Friends />
    </div>
    
</SwipeableViews>
<div style={{position:"fixed",bottom:"2rem",right:"2rem",
display:"none",flexDirection:"column",gap:"1rem"}}>
    
   <Fab arial-label="profile"  onClick={create_new_challenge} style={{
        backgroundColor:"indianred",
        color:"whitesmoke"
    }}>
        <AddIcon style={{color:"whitesmoke"}} />
    </Fab>
  
    
    </div>

    <MainFooter click={change_page} page={page} />

    <button  className="chat_btn" onClick={e=>set_open(true)}>
         <ForumIcon style={{color:"white",fontSize:"1.2rem"}} />
    </button>

    <BottomSheet open={open}>
                <Chat click={close_modal}/>
            </BottomSheet>

    </div>
    );
}

export default Main;