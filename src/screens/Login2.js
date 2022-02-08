import "../styles/login2.scss";
import logo from "../components/img/logo.png";
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import GoogleIcon from "../components/GoogleIcon";
import {useEffect, useState,useRef} from "react";
import Modal from "../components/Modal";
import ForgetLoginDetails from "../components/ForgetLoginDetails";
import {useHistory} from "react-router-dom";
import {db,auth} from "../firebase_file";
import firebase from "firebase";

const Login=()=>{
    const ref_email=useRef(null);
    const ref_pw=useRef(null);
    const [open,set_open]=useState(false)
    const [alerte,set_alerte]=useState("");
    const history=useHistory();


    const close_modal=()=>{
        set_open(false);
    }
    

    useEffect(()=>{
       
        if(ref_email.current==null){
            return;
        }
        console.log("the ref is ",ref_email.current);
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

    const go_to_sign_up=()=>{
        history.push("/sign-up");
    }

    const login=(e)=>{
        set_alerte("");
        const email=ref_email.current.value;
        const password=ref_pw.current.value;
       if(email==""){
           set_alerte("The email is empty");
           return;
       }
       if(password==""){
           set_alerte("The password is empty");
           return;
       }

       const btn=e.target;
       btn.disabled=true;
       btn.innerHTML="Please wait...";

       auth.signInWithEmailAndPassword(email,password).then(()=>{
            history.replace("/");
       }).catch((err)=>{
            btn.disabled=false;
            btn.innerHTML="Finish";
            set_alerte(err.message);
       })
    }

    const login_with_google=(e)=>{
        const btn=e.target;
        var provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider).then(async (res)=>{
            const email=res.user.email;
            const uid=res.user.uid;
            const get=await db.collection("psg_users").where("email","==",email).get();
            btn.disabled=false;
            btn.style.opacity="1";
           
            if(get.docs.length>0){
               history.replace("/");
            }else{
                set_alerte("Incorrect login details");
                await auth.currentUser.delete();
                await auth.signOut();
                history.replace("/");
            }
            
        }).catch((err)=>{
            btn.disabled=false;
            btn.style.opacity="1";
            
            set_alerte(err.message)
        })
    }

    return (
        <div className="login2">
            {open==true && <Modal  
            open={true}
            click={close_modal}
            content={<ForgetLoginDetails click={close_modal} />} 
            />}
            <div className="login_body">
                <div className="top">
                   
                    <p className="brand">ProSport.Guru .Inc</p>
                </div>
                <div className="form">
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
                        <button onClick={login}>Log In</button>
                    </div>

                    <div className="line">
                        <p>{alerte}</p>
                    </div>
                    <div className="line" >
                        <button className="btn_forget" onClick={e=>set_open(true)}>Forget your login details?  
                            <span> Get help signing in.</span>
                        </button>
                    </div>
                </div>

                <div className="info_zone">
                    <div className="or_zone">
                        <div></div>
                        <div>OR</div>
                        <div></div>
                    </div>

                    <div className="provider_zone">
                        <button onClick={login_with_google}>
                            <GoogleIcon />
                            Log In with Google
                        </button>
                    </div>
                </div>
            </div>
            <div className="login_footer">
                <p onClick={go_to_sign_up}>Don't have an account?
                    <span>Sign Up</span>
                </p>
            </div>
        </div>
    )
}

export default Login;