import React,{useState,useEffect} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import MoreIcon from '@material-ui/icons/MoreVert';
import SettingsIcon from '@material-ui/icons/Settings';
import {useSelector,useDispatch} from "react-redux";
import {selectChallengeDate,selectTab,selectUsers,setActiveSearch,setActiveTab,setChallenge_date,setSelectedPlayer,setTab} from "../features/counterSlice";
import { Avatar } from "@material-ui/core";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { auth, db } from '../firebase_file';
import { useHistory } from 'react-router';
import { Badge } from '@material-ui/core';
import logo from "./img/psg2.png";
import DatePicker from "react-horizontal-datepicker";
import "../styles/header2.scss";
import TopLeagues from "./TopLeagues";
import PersonIcon from '@material-ui/icons/Person';
import LockOpenIcon from '@material-ui/icons/LockOpen';

import {useTransition,animated} from "react-spring";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    color:"white"
   
  },
  toolbar: {
    
    alignItems: 'center',
    backgroundColor:"#474f4f",
    color:"white"
    
  },
  title: {
    flexGrow: 1,
    alignSelf: 'flex-end',
    opacity:0,
  },

  bottom:{
      display:"flex",
      justifyContent:"center",
      backgroundColor:"#2c3333",
      "& > button":{
          flex:1,
          padding:"0.3rem",
          border:"none",
          backgroundColor:"transparent",
          color:"white",
          fontSize:"1rem",
          display:"flex",
          justifyContent:"center",
          alignItems:"center",
          outline:"none",
          cursor:"pointer",
          "&.active":{
            borderBottom:"3px solid indianred",
            fontWeight:"bold"
          }
      }
  }

}));

export default function ProminentAppBar({onGames_drawer_closed,index,click_profile}) {

    const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const history=useHistory();

  const u=useSelector(selectUsers);

  const classes = useStyles();
  const [tab,set_tab]=useState(0)
  const dispatch= useDispatch();

  const tab_index=useSelector(selectTab);
  useEffect(()=>{
    set_tab(tab_index);
    const btns=document.querySelectorAll("#top_btns > button");
    btns.forEach((btn)=>{
        btn.classList.remove("active");
    })
    //console.log("the real index is ",tab_index)
    btns[tab_index]?.classList.add("active");
  },[tab_index]);

  const handle_set_tab=(index)=>{
      //console.log(index);
      if(index==undefined){
          return;
      }
      dispatch(setTab(index));
     // set_tab(index);
     //console.log("here we go",index)
  }

  const go_to_bought_picks=()=>{
    history.push("/bought-picks");
  }
  const go_to_profile=()=>{
    const email=auth.currentUser.email;
    const res=u.filter((user)=>{
       return user.email==email;
    })

    const user=res[0];
    dispatch(setSelectedPlayer(user));
    history.push("/profile");

}

const logout=()=>{
  auth.signOut();
  history.replace("/");      
}

const go_to_home=()=>{
  dispatch(setActiveTab(0)); 
}


const go_to_lobby=()=>{
  //history.push("/lobby");
}

const go_to_friends=()=>{
  dispatch(setActiveSearch(true))
  //history.push("/start-game");
  history.push("/search");
}
const go_to_wallet=()=>{
  history.push("/wallet");
}

const go_to_subscription=()=>{
	history.push("/subscription");
}

const [invite,setInvite]=useState(0)
useEffect(()=>{
 const unsub= db.collection("psg_challenges").onSnapshot((snap)=>{
    const total_invite=[];
    snap.docs.map((doc)=>{
      const id_challenge=doc.id;
      const friend=doc.data()?.friend;
      //console.log("freinds are ",friend);
      const user=doc.data()?.user;
      if(friend?.indexOf(auth?.currentUser.email)>=0 || user==auth?.currentUser.email){
        total_invite.push(id_challenge);
      }
    });
    let i=0;
    console.log("total is now ",total_invite);
    total_invite.map((ch)=>{
      
      const res=db.collection("psg_picks")
      .where("id_challenge","==",ch)
      .where("user","==",auth?.currentUser.email)
      .onSnapshot((snap)=>{
        if(snap.docs.length==0){
          i++;
          setInvite(i);
        }
      })
      
    })
  })

  return unsub;
},[]);

const [photo,set_photo]=useState("foo.jpg");
useEffect(()=>{
  if(auth?.currentUser==null || u==null) return;
  const res=u.filter((item)=>{
    return item.email==auth?.currentUser?.email;
  })
  if(res.length>0){
    set_photo(res[0].photo)
  }
},[auth,u]);



const selectedDay = (val) =>{
  //alert(val);
  dispatch(setChallenge_date(val));
  
};

const scd=useSelector(selectChallengeDate);
const [calenda,set_calenda]=useState(scd);
useEffect(()=>{
  if(scd!=""){
    set_calenda(scd);
  }
},[scd]);



const [show_logo,set_show_logo]=useState([1]);
const transition_logo=useTransition(show_logo,{
  from:{x:0,y:-100,opacity:0},
  enter:item=>async (next)=>{
    await next({x:0,y:0,opacity:1,delay:100});
    
  },
  leave:{}
})

const [show_right_menu,set_show_right_menu]=useState([1]);
const transition_right_menu=useTransition(show_right_menu,{
  from:{x:100,y:0,opacity:0},
  enter:item=>async (next)=>{
    await next({x:0,y:0,opacity:1});
  },
  leave:{}
})
  return (
    <div className={classes.root} id="header">
      <AppBar position="static">
        <Toolbar className={classes.toolbar} >
          
          {
            transition_logo((style,item)=>{
              if(item){
                return(
                  <animated.h1 style={{display:"flex",alignItems:"center",...style}} onClick={go_to_lobby}>
                    <img src={logo} style={{width:50,height:40}}/>
                  </animated.h1>
                )
              }
            })
          }

          <button style={{
            flex:1,
            margin:"0.5rem",
            marginTop:"0.3rem",
            display:"flex",
            alignItems:"center",
            backgroundColor:"rgba(0,0,0,0.2)",
            borderRadius:"3px",
            position:"fixed",
            width:"50%",
            top:"0.5rem",
            left:"25%",
            zIndex:1,
            fontSize:"0.7rem",
            color:"silver",
            border:"none",
            padding:"0.3rem",
            }}
            
            onClick={go_to_friends}>
              <SearchIcon style={{color:"silver",fontSize:"1.2rem"}} 
              
              />
            Search players

          </button>
          
          <Typography className={classes.title} variant="h5" noWrap>
            Material-UI
          </Typography>
         
          {index==-1 && 
         <IconButton aria-label="search" color="inherit" onClick={onGames_drawer_closed}>
          <SettingsIcon style={{color:"white"}} /> 
          </IconButton>
         } 

         {
           transition_right_menu((style,item)=>{
             if(item){
               return(
                 <animated.div style={style,{display:"none"}}>
                    <IconButton aria-label="search" color="inherit" onClick={go_to_friends}>
                      <SearchIcon style={{color:"white"}} />
                    </IconButton>
                    

                 </animated.div>
               
               )
             }
           })
         }


{
           transition_right_menu((style,item)=>{
             if(item){
               return(
                 <animated.div style={style}>
                    <IconButton aria-label="display more actions" edge="end" color="inherit" 
                      onClick={handleClick}>
                        {photo =="foo.jpg" && <Avatar style={{width:"30px",height:"30px",borderRadius:"50%"}}>
                          {auth?.currentUser?.displayName[0].toLowerCase() }</Avatar>}
                        {photo != "foo.jpg" && <img src={photo}
                        style={{width:"30px",height:"30px",borderRadius:"50%",
                        border:"1px solid gray",
                        }} />}
                    </IconButton>
                 </animated.div>
               
               )
             }
           })
         }
          

        
        
         
          
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            
            >
           
           <MenuItem onClick={e=>{
             //handleClose();
             
             click_profile(auth?.currentUser?.email);
           }}
           >
             <PersonIcon style={{fontSize:"1.2rem",color:"gray",paddingRight:"1rem"}} />
             Profile</MenuItem>

           <MenuItem onClick={e=>{
             history.push("/settings")
           }}>
             <SettingsIcon style={{fontSize:"1.2rem",color:"gray",paddingRight:"1rem"}}/>
            Settings
           </MenuItem>
           {/*
           <MenuItem onClick={go_to_profile}>Profile</MenuItem>
           <MenuItem onClick={go_to_subscription}>Subscription</MenuItem>
           <MenuItem onClick={go_to_wallet}>My wallet</MenuItem>
            <MenuItem onClick={go_to_bought_picks}>Picks Bought</MenuItem>*/}
            
            <MenuItem onClick={logout}>
              <LockOpenIcon style={{fontSize:"1.2rem",color:"gray",paddingRight:"1rem"}} />
              Logout</MenuItem>
         </Menu>


        </Toolbar>

        <TopLeagues />
       
      </AppBar>
    </div>
  );
}
