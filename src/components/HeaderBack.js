import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useEffect, useState } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { selectActiveSearch, selectPageName, selectSinglePageName, 
selectLeagues,
  selectUsers, setActiveSearch, setMultipleFriend,selectMultipleFriend, 
  selectSelectedPlayer,
  setSearchFriendtext, selectInvitedFriend, setInvitedFriends, setFriendChallenged } from '../features/counterSlice';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import DirectionsIcon from '@material-ui/icons/Directions';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import LibraryAddCheckIcon from '@material-ui/icons/LibraryAddCheck';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import BottomSheet from "./BottomSheet";
import { icons } from "../functions";

import History from "./History";
import TrophyRoom from "./TrophyRoom";
const useStyles = makeStyles((theme) => ({
    root: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: "97%",
      margin:"auto", 
      position:"sticky",
      top:0,
      zIndex:1,
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
  }));
  
  
const HeaderBack=(props)=>{
    const history=useHistory();
    const dispatch=useDispatch();
    const pn=useSelector(selectSinglePageName);
	const l=useSelector(selectLeagues);
    const u=useSelector(selectUsers);
    const as=useSelector(selectActiveSearch);
    const [multiple_friends,set_multiple_friends]=useState(false);
    const fi=useSelector(selectInvitedFriend)
	
	const p=useSelector(selectSelectedPlayer);
	
	const [player,setPlayer]=useState({});
    const [user,setUser]=useState(p);
	
	const [icon,setIcon]=useState(null);
	const [league,set_league]=useState("");
	
	
	useEffect(()=>{
        
        setPlayer(p);
        if(p.detail!=undefined){
            setUser(p.detail);
        }else{
            setUser(p);
        }
    },[p]);
	   
	 useEffect(()=>{
		if(props.challenge!=undefined){
			const id_sport=props.challenge.sport;
		   const res=icons.filter((sport)=>{
			   return sport.id==id_sport;
		   });
		   //console.log(res);
		   if(res.length>0){

			   setIcon(res[0].icon);
		   }
		   
		   set_league(l.filter((el)=>{
				return el.id==props.challenge.league;
			})[0]?.name)
		} 
	 },[l])

    useEffect(()=>{
        if(u.length==0){
            history.push("/");
            return;
        }
    },[u]);

    const [pageName,setpn]=useState("");
    const go_back=()=>{
        dispatch(setActiveSearch(false));
        dispatch(setMultipleFriend(false));
        history.goBack();
    }

    useEffect(()=>{
        setpn(pn);
    },[pn]);

    const back_to_home=()=>{
        history.replace("/");
    }

    useEffect(()=>{
        if(u.lenth==0){
            alert("ok going back")
            history.replace("/");
        }
      },[u]);
      const classes = useStyles();

     const [focus,setFocus]=useState(as);
     useEffect(()=>{
        setFocus(as);
     },[as]);

     const [search,set_search]=useState("");
     useEffect(()=>{
            dispatch(setSearchFriendtext(search));
     },[search]);

     const mf=useSelector(selectMultipleFriend);

     useEffect(()=>{
      set_multiple_friends(mf);
     },[mf]);

     const bulk_invitation=(e)=>{
       e.preventDefault();
       if(fi.length==0){
         alert("Please select friends to continue");
         return;
       }

       const friends=[];
       fi.map((user)=>{
        const friend={...user,type:5};
        friends.push(friend);
       })
      dispatch(setFriendChallenged(friends));
      dispatch(setActiveSearch(false))
      history.push("/challenge-friend")
     }
	 
	 
	 const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  

      if(props.friends==undefined){
    return(
        
        <div className="header_back">
		
		
		
		<Menu
			style={{marginTop:"45px"}}
            id="simple-menu2"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            >
           <MenuItem>
				<BottomSheet
				content={<TrophyRoom userInfo={user} />}
				startHidden={true}
				buttonElement={
				<button 
				style={{
					display:"flex",
					alignItems:"center",
					padding:"0.2rem 1rem",
					border:"none",
					outline:"none",
					backgroundColor:"white"
				   }}
				>
				   Trophy Room
				</button>
			   
			}
				/>
		   </MenuItem>
           <MenuItem>
           
			<BottomSheet
				content={<div style={{
          
          minHeight:"60vh",
          maxHeight:"60vh",
          padding:"1rem",
          paddingTop:0,
          overflowY:"auto",
          overflowX:"hidden"
        }}
        onClick={e=>e.stopPropagation()}
        ><History userInfo={user} /></div>}
				startHidden={true}
				buttonElement={
				<button 
				style={{
					display:"flex",
					alignItems:"center",
					padding:"0.2rem 1rem",
					border:"none",
					outline:"none",
					backgroundColor:"white"
				   }}
				>
				   History
				</button>
			   
			}
				/>
      
		   </MenuItem>
          
         </Menu>
            
            <div>
                <button onClick={go_back}>
                    <ArrowBackIcon />
                </button>
				{
					props.challenge!=undefined && 
					<div style={{
						display:"flex",
						alignItems:"center",
						gap:"0.5rem",
					}}>
					<p style={{
						marginRight:"0.5rem"
					}}>{icon}</p> 
					<p style={{
						marginRight:"0.5rem"
					}}>{league}</p>
				</div>
				}
                {
                    props.title_redux==true && (
                        <p>{pageName}</p>
                    )
                }
                <p>{props.title}</p>
				
				{
					(props.show_menu !=undefined && props.show_menu==true)&& 
					<button onClick={handleClick} style={{display:"flex",opacity:0,justifyContent:"flex-end",alignItems:"center"}}>
                    <MoreVertIcon />
                </button>
				}
				
				{
					props.show_empty_div==true && <div style={{flex:1}}></div>
				}
                
            </div>
			
			
           
            
        </div>
    );
    }

    if(props.friends==true){
        return(
            
            <Paper component="form" className={classes.root}>
      <IconButton className={classes.iconButton} aria-label="menu" onClick={go_back}>
      <ArrowBackIcon />
      </IconButton>
      <InputBase
        className={classes.input}
        placeholder="Search by username or email "
        inputProps={{ 'aria-label': 'search google maps' }}
        value={search}
        onChange={e=>set_search(e.target.value)}
        autoFocus={focus}
      />
      <IconButton  className={classes.iconButton} aria-label="search">
        <SearchIcon />
      </IconButton>
      <Divider className={classes.divider} orientation="vertical" />
      <IconButton color="primary" className={classes.iconButton} aria-label="directions"
        onClick={e=>{
          if(multiple_friends==true){
            dispatch(setInvitedFriends([]));
          }
          set_multiple_friends(!multiple_friends)
          dispatch(setMultipleFriend(!multiple_friends));
         
        }}
      >
        {multiple_friends==false &&  <CheckBoxOutlineBlankIcon />}
        {multiple_friends==true &&  <LibraryAddCheckIcon />}
      </IconButton>
      {multiple_friends==true && <Divider className={classes.divider} orientation="vertical" />}
      {multiple_friends==true && <button style={{
        padding:"0.8rem 0.3rem",
        border:"none",
        backgroundColor:"indianred",
        color:"white",
        fontWeight:"bold"
        }}
        onClick={bulk_invitation}
        >Bulk invitation({fi?.length})</button>}
    </Paper>

        );
    }
}

export default HeaderBack;