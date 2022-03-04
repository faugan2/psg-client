import "../styles/user_profile_info.scss";
import { useSelector,useDispatch } from "react-redux";
import { selectUserProfile,selectUsers, selectFollow} from "../features/counterSlice";
import {useState,useEffect,useRef} from "react";
import {auth,db} from "../firebase_file";
import EditIcon from '@material-ui/icons/Edit';
import ReplyIcon from '@material-ui/icons/Reply';
import GroupIcon from '@material-ui/icons/Group';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import {useHistory} from "react-router-dom";
import firebase from "firebase";

const UserProfileInfo=({stats,nb_matches_picks,coins})=>{
    const history=useHistory();

    const email=useSelector(selectUserProfile);
    const users=useSelector(selectUsers);
    const follow=useSelector(selectFollow);
   

    const [user,set_user]=useState(null);
    const [me,set_me]=useState(false);
    const [club,set_club]=useState(0);
    const [can_follow,set_can_follow]=useState(false);

    const ref_btn_follow=useRef(null);

    useEffect(()=>{
        const res=follow.filter((item)=>{
            return item.user==email;
        })

        set_club(res.length);

        if(email==auth?.currentUser?.email){
            return;
        }

        const res2=follow.filter((item)=>{
            return item.user==auth?.currentUser?.email && item.follow==email; 
        })
       
        if(res2.length==0){
            set_can_follow(true)
        }else{
            set_can_follow(false);
        }

    },[follow]);
    
    useEffect(()=>{
        if(email==null) return;
        if(users==null) return;

        const res=users.filter((u)=>{
            return u.email==email;
        })
        
        if(res.length>0){
            
            set_user(res[0]);
        }

        
    },[email,users])

    useEffect(()=>{
        if(user==null) return;
        if(user.email==auth?.currentUser?.email){
            set_me(true)
        }else{
            set_me(false);
        }
    },[user])

    const edit_profile=()=>{
        history.push("/profile-edit");
    }
    const go_to_coins=()=>{
        history.push("/coins");
    }

    const go_to_my_club=()=>{
        if(email==auth?.currentUser?.email){
            history.push("/my-club");
        }
    }

    const handle_follow=async ()=>{
        const user=auth?.currentUser?.email;
        if(can_follow==true){
            const line={
                accept:false,
                date:firebase.firestore.FieldValue.serverTimestamp(),
                user,
                follow:email
            }
           
           await db.collection("psg_follow").add(line);
          
        }else{
            const res=follow.filter((item)=>{
                return item.user==user && item.follow==email;
            })
            if(res.length>0){
                const key=res[0].key;
                await db.collection("psg_follow").doc(key).delete();
               
            }
        }
    }
    return(
        <div className="user_profile_info">
            <div className="top">
                <img src={user?.photo} />
                <p>{user?.username}</p>

                {me==true && <button className="edit_btn"
                    onClick={edit_profile}
                >
                    <EditIcon style={{fontSize:"1.2rem",color:"gray"}} />
                    Edit Profile
                </button>
                }

                {me==true && <button className="wallet_btn" onClick={go_to_coins}>
                    <p>{coins}</p>
                    <p>Total Coins</p>
                </button>
                }

                {me==false && <button className="follow_btn" onClick={handle_follow} ref={ref_btn_follow}>
                    {
                        can_follow==true ? 
                        <div>
                                <ReplyIcon style={{fontSize:"1.2rem"}} />
                                Follow
                        </div>:
                        <div>
                        <ReplyIcon style={{fontSize:"1.2rem",color:"indianred"}} />
                        Unfollow
                     </div>

                    }
                    
                </button>
                }

                {me==false && <button className="challenge_btn">
                    <GroupIcon style={{fontSize:"1.2rem"}} />
                    Challenge
                </button>
                }
                
            </div>

            <div className="top_status">
                <p>{user?.status}</p>
                <div>
                    <button>
                        <StarBorderIcon style={{fontSize:"1rem",color:"indianred"}} />
                    </button>
                    <button>
                        <StarBorderIcon style={{fontSize:"1rem",color:"gray"}} />
                    </button>
                    <button>
                        <StarBorderIcon style={{fontSize:"1rem",color:"gray"}} />
                    </button>
                    <button>
                        <StarBorderIcon style={{fontSize:"1rem",color:"gray"}} />
                    </button>
                    <button>
                        <StarBorderIcon style={{fontSize:"1rem",color:"gray"}} />
                    </button>
                </div>
            </div>

            <div className="top_stats">
                <button>
                    <p>{nb_matches_picks.total_matches}</p>
                    <p>Matches</p>
                </button>
                <button>
                    <p>{nb_matches_picks.total_picks}</p>
                    <p>Picks</p>
                </button>
                <button onClick={go_to_my_club}>
                    <p>{club}</p>
                    <p>My Club</p>
                </button>
            </div>

            <div className="top_reports">
                <div className="top">
                    <p>Reports Card</p>
                    <p>All</p>
                </div>
                <div className="content">
                    <div className="line">
                        <p>Win</p>
                        <p>{stats.wins}</p>
                    </div>
                    <div className="line">
                        <p>Lost</p>
                        <p>{stats.loses}</p>
                    </div>
                    <div className="line">
                        <p>Overall Winning %</p>
                        <p>{stats.win_per}</p>
                    </div>
                    <div className="line">
                        <p>Longest Winning Streak</p>
                        <p>{stats.streak}</p>
                    </div>
                    <div className="line">
                        <p>Last 10</p>
                        <p>{stats.last_10}</p>
                    </div>
                    <div className="line">
                        <p>Last 200</p>
                        <p>{stats.last_200}</p>
                    </div>
                    <div className="line">
                        <p>Over/Under</p>
                        <p>{stats.over_under}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default UserProfileInfo;