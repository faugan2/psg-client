import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import DesktopMacIcon from '@material-ui/icons/DesktopMac';
import GroupIcon from '@material-ui/icons/Group';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import PetsIcon from '@material-ui/icons/Pets';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { auth } from "../firebase_file";
import { selectMyPicks, selectPicks, setStartPlaying,setInvitedFriends,setFriendChallenged } from '../features/counterSlice';
import { FormatListNumberedRtlTwoTone } from '@material-ui/icons';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide({userInfo}) {
  const dispatch=useDispatch();
  const history=useHistory();
  const [open, setOpen] = useState(false);
  const [picks,setAll_picks]=useState([]);
  const [show_start,setShow_start]=useState(false);
  const p=useSelector(selectPicks)
  const mypicks=useSelector(selectMyPicks);
  const [user_email,set_user_email]=useState("");

  useEffect(()=>{
    if(userInfo==undefined){
      if(mypicks.length>0){
        setShow_start(false);
      }else{
        setShow_start(true);
      }
      
      setAll_picks(mypicks);
    }else{
      setShow_start(false);
      const ue=userInfo.email;
	  set_user_email(ue);
      const res=p.filter((item)=>{
        //console.log(item);
        return item.user==ue;
      })
      setAll_picks(res);
    }

  },[p,mypicks]);

  const handleClickOpen = () => {
    //(true);
    
	
	dispatch(setInvitedFriends([]));
	dispatch(setFriendChallenged({}))
	history.push("/challenge-friend");
  };

  const handleClose = () => {
    setOpen(false);
  };

  const start_playing=(type)=>{
    dispatch(setStartPlaying(type));
    history.push("/start-playing");
  }

  return (
    <div className="start">
      <div className="no_records">
	  
        {
          picks.length>0 && <p>Pending records...</p>
        }
		
		{
		  /*picks.length==0 && auth?.currentUser.email!=user_email && <p>No data found</p>*/
		}
		
      </div>

      {
		  show_start ==true && 
			<button className="btn_stats_follow"  onClick={handleClickOpen}>
			Start Playing Now
			</button>
      }
	  
      
    </div>
  );
}