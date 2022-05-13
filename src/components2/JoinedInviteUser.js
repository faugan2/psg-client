import "../styles/joined_invite_user.scss";
import {useSelector,useDispatch} from "react-redux";
import {selectUsers,selectLine,selectTournaments} from "../features/counterSlice";
import {useState,useEffect} from "react";
import {auth,db} from "../firebase_file";
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';
const JoinInviteUser=({click})=>{
    const line=useSelector(selectLine);
    const users=useSelector(selectUsers);
    const t=useSelector(selectTournaments);

    const [invites,set_invites]=useState([]);

    useEffect(()=>{
        if(line==null) return;
        if(users==null || users.length==0) return;

        let old_invites=[];
        if(line.invites!=undefined){
            old_invites=[...line.invites];
        }

        const res=users.filter((item)=>{
            return old_invites.indexOf(item.key)<0 && item.email != line.user && 
            item.email!=auth?.currentUser.email;
        })
        //console.log("now all is now ",res)
        set_invites(res);
    },[line,users,t])

    const invite_user=(key)=>{
        const btns=document.querySelectorAll(".a_user_invite");
        const spinner=document.querySelector(".spinner_"+key);
        spinner.style.display="block";
        let old=[];
        if(line.invites!=undefined){
            old=[...line.invites];
        }
        old.push(key)
        let user="";
        if(line.user==undefined){
            db.collection("psg_challenges").doc(line.key).update({invites:old,user:auth?.currentUser?.email},{merge:true}).then(()=>{
                click(2);
            });
        }else{
            db.collection("psg_challenges").doc(line.key).update({invites:old},{merge:true}).then(()=>{
                click(2)
            });
        }
        

    }
    
    return(
        <div className="joined_invite_user">
           <div>

          
           {invites.map((user)=>{
               return(
                   <button key={user.key} className="a_user_invite" onClick={invite_user.bind(this,user.key)}>
                       <img src={user.photo} />
                       <p>{user.username}</p>
                        <div className={"spinner_"+user.key} style={{display:"none"}}>
                            <CircularProgress size={15} />
                        </div>
                   </button>
               )
           })}
            </div>

           
        </div>
    )
}
export default JoinInviteUser;