import "../styles/edit_user_name.scss";
import HeaderBottomSheet from "./HeaderBottomSheet";
import CloseIcon from '@material-ui/icons/Close';
import {auth,db} from "../firebase_file";
import {useState,useEffect,useRef} from "react";
import {useSelector,useDispatch} from "react-redux";
import {selectUsers} from "../features/counterSlice";
import CircularProgress from '@material-ui/core/CircularProgress';
const EditUserName=({click})=>{
    const users=useSelector(selectUsers);
    const [me,set_me]=useState(null);
    const [username,set_username]=useState("");
    const [changing_username,set_changing_username]=useState(false);

    const ref=useRef(null);

    useEffect(()=>{
        if(users==null || auth.currentUser==null) return;
        const res=users.filter((item)=>{
            return item.email==auth?.currentUser?.email;
        })
        if(res.length>0){
            set_me(res[0]);
            set_username(res[0].username)
        }
    },[users,auth])
    const change_username=async (e)=>{
        const un=ref.current.value;
        const btn=e.target;
        if(un=="") return;

        set_changing_username(true);
        btn.disabled=true;

         db.collection("psg_users").doc(me?.key).update({username:un},{merge:true}).then(async ()=>{
            set_changing_username(false);
            btn.disabled=false;
            await auth.currentUser?.updateProfile({
                displayName:un
            })
            setTimeout(()=>{
                click();
            },1000)
            
        }).catch((err)=>{
            set_changing_username(false);
            btn.disabled=false;
        })
    }
    return(
        <div className="edit_user_name">
            <div className="content">
                <div className="line">
                    <input type="text" placeholder="Input your name" 
                    onChange={e=>set_username(e.target.value)}
                    value={username} ref={ref}/>
                    <button onClick={change_username}>
                        {changing_username==true && 
                        <CircularProgress style={{fontSize:"1.2rem",color:"white"}} size={15} />}
                        Save</button>
                </div>

               
            </div>

            <HeaderBottomSheet title="Change your name">
                <button onClick={click}>
                    <CloseIcon style={{fontSize:"1.2rem"}}/>
                </button>
            </HeaderBottomSheet>
            
        </div>
    )
}

export default EditUserName;