import "../styles/login2.scss";
import logo from "../components/img/logo.png";
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import GoogleIcon from "../components/GoogleIcon";
import {useEffect, useState,useRef} from "react";
import Modal from "../components/Modal";
import ForgetLoginDetails from "../components/ForgetLoginDetails";
import {useHistory} from "react-router-dom"
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import {auth, db } from "../firebase_file";
import firebase from "firebase";
import {useDispatch, useSelector} from "react-redux";
import {setRegisterInfo} from "../features/counterSlice";

const Login=()=>{
    const ref_email=useRef(null);
    const ref_pw=useRef(null);
    const ref_name=useRef(null);
    const [open,set_open]=useState(false)
    const history=useHistory();
    const [alerte,set_alerte]=useState("");
    const dispatch=useDispatch();

    const close_modal=()=>{
        set_open(false);
    }

    useEffect(()=>{
       
        if(ref_email.current==null){
            return;
        }
        ref_email.current.addEventListener("focus",focused);
        ref_email.current.addEventListener("blur",blured);
        return()=>{
            if(ref_email.current!=null){
                ref_email.current.removeEventListener("focus",focused);
                ref_email.current.removeEventListener("blured",blured);
            }
            
        }
    },[ref_email])

    useEffect(()=>{
       
        if(ref_name.current==null){
            return;
        }
        ref_name.current.addEventListener("focus",focused);
        ref_name.current.addEventListener("blur",blured);
        return()=>{
            if(ref_name.current!=null){
                ref_name.current.removeEventListener("focus",focused);
                ref_name.current.removeEventListener("blured",blured);
            }
            
        }
    },[ref_name])


    useEffect(()=>{
        
        if(ref_pw.current==null){
            return;
        }
        ref_pw.current.addEventListener("focus",focused);
        ref_pw.current.addEventListener("blur",blured);
        return()=>{
            if(ref_pw.current!=null){
                ref_pw.current.removeEventListener("focus",focused);
                ref_pw.current.removeEventListener("blured",blured);
            }
            
        }
    },[ref_pw])

    const focused=()=>{
        document.querySelector(".login_footer").style.display="none";
    }
    const blured=()=>{
        document.querySelector(".login_footer").style.display="flex";
    }

    const go_to_login=()=>{
        history.replace("/login2");
    }

    const clear_alerte=()=>{
        setTimeout(()=>{
            set_alerte("");
        },3000)
    }
    const register=async(e)=>{
        set_alerte("");
        const name=ref_name.current.value;
        const email=ref_email.current.value;
        const password=ref_pw.current.value;
        if(name==""){
            set_alerte("The name is empty");
            return;
        }
        if(email==""){
            set_alerte("The email is empty");
            return;
        }

        if(password==""){
            set_alerte("The password is empty");
            return;
        }
        const user={
            username:name,
            password,
            email,
            date:firebase.firestore.FieldValue.serverTimestamp(),
            coins:"5000",
            last_10:"0",
            last_200:"",
            loses:"0",
            status:"clown",
            streak:"0",
            ties:"0",
            win_per:"0.00",
            wins:"0"
        }

        dispatch(setRegisterInfo(user));
        history.push("/profile-photo");
    }

    const register_with_google=async (e)=>{
        var provider = new firebase.auth.GoogleAuthProvider();
        const btn=e.target;

        
        btn.disabled=true;
        btn.style.opacity="0.6";
       

        try{
            const res=await auth.signInWithPopup(provider);
           
            const email=res.user.email;
            const get=await db.collection("psg_users").where("email","==",email).get();
            if(get.docs.length>0){
                set_alerte("You can't create a new account with this email adress")
                await auth.currentUser.delete();
                await auth.signOut();
                
                btn.disabled=false;
                btn.style.opacity="1";
            }else{

                await db.collection("psg_users").add({
                    email,
                    password:email,
                    photo:res.user.photoURL,
                    coins:"5000",
                    date:firebase.firestore.FieldValue.serverTimestamp(),
                    wins:"0",
                    loses:"0",
                    status:"clown",
                    streak:"0",
                    last_10:"0",
                    last_200:"0",
                    ties:"0",
                    username:res.user.displayName,
                    win_per:"0.00"
                })
                
                btn.disabled=false;
                btn.style.opacity="1";
                history.replace("/")
            }
        }catch(err){
            btn.disabled=false;
            btn.style.opacity="1";
            set_alerte(err.message)
        }
    }

    return (
        <div className="login2">
          
            <div className="login_body">
                <div className="top">
                   
                    <p className="brand">ProSport.Guru .Inc</p>
                </div>
                <div className="form">
                    <div className="line">
                        <label>Name</label>
                        <div>
                            <input type="text" ref={ref_name}/>
                            <PermIdentityIcon styles={{color:"gray"}} />
                        </div>
                    </div>

                    <div className="line">
                        <label>Email</label>
                        <div>
                            <input type="email" ref={ref_email}/>
                            <MailOutlineIcon styles={{color:"gray"}} />
                        </div>
                    </div>

                    <div className="line">
                        <label>Password</label>
                        <div>
                            <input type="password" ref={ref_pw} />
                            <LockOpenIcon  styles={{color:"gray"}}/>
                        </div>
                    </div>

                    <div className="line">
                        <button onClick={register}>Sing Up </button>
                    </div>

                   {alerte!="" && <div className="line">
                       <p style={{color:"indianred",textAlign:"center"}}>{alerte}</p>
                    </div>
                    }
                   
                </div>

                <div className="info_zone">
                    <div className="or_zone">
                        <div></div>
                        <div>OR</div>
                        <div></div>
                    </div>

                    <div className="provider_zone">
                        <button onClick={register_with_google}>
                            <GoogleIcon />
                            Sign Up with Google
                        </button>
                    </div>
                </div>
            </div>
            <div className="login_footer">
                <p onClick={go_to_login}>Already signed up?
                    <span>Sign In</span>
                </p>
            </div>
        </div>
    )
}

export default Login;