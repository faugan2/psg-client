import React,{ useEffect, useState} from 'react'
import "../../styles/login.scss";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from 'react-router-dom';
import logo from "../img/logo.png";
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import CircularProgress from '@material-ui/core/CircularProgress';
import DoneIcon from '@material-ui/icons/Done';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import GoogleIcon from "../GoogleIcon";
import {auth, db,storage} from "../../firebase_file";
import firebase from "firebase";

import { ToastContainer } from 'react-toastify';
import RefreshIcon from '@material-ui/icons/Refresh';



import {set_toast} from "../data";

export default function Login({close}) {
    const history=useHistory();

    const [show_pw,set_show_pw]=useState(false);
    const [title,set_title]=useState("Sign up");
    const [state,set_state]=useState(0);
    const [user_email,set_user_email]=useState("");
    const [code,set_code]=useState("");
    const [sending_code,set_sending_code]=useState(false);
    const [checking_code,set_checking_code]=useState(false);

    useEffect(()=>{
        let c="";
        for(var i=0; i<6;i++){
            c+=Math.round(Math.random()*9);
        }
        set_code(c);
    },[])

    const show_login=()=>{
        set_state(1);
        set_title("Login");
    }

    const show_register=()=>{
        set_state(0);
        set_title("Sign up");
    }


    const register=async ()=>{
        const name=document.querySelector("#r_name").value;
        const last_name=document.querySelector("#r_lname").value;
        const email=document.querySelector("#r_email").value;
        const password=document.querySelector("#r_password").value;



        if(name==""){
            set_toast("Please enter your name",0);
            return;
        }
        if(email==""){
            set_toast("Please enter your email address",0);
            return;
        }
        if(password==""){
            set_toast("Please create a password",0);
            return;
        }
        if(password.lenth<6){
            set_toast("Your password should be at least 6 caracters",0);
            return;
        }

        set_user_email(email);


        let user_name=name[0]+last_name+code;
        user_name=user_name.toLowerCase();
        user_name=user_name.replace(" ","");



        //await auth.createUserWithEmailAndPassword(email,password);
        const user={
            coins:"50",
            date:firebase.firestore.FieldValue.serverTimestamp(),
            email,
            last_10:"0",
            last_200:"0",
            loses:"0",
            password,
            photo:null,
            status:"Clown",
            streak:"0",
            ties:"0",
            first_name:name,
            last_name,
            username:user_name,
            win_per:"0.00",
            wins:"0",
            code,
            verify:false,
        }

        db.collection("psg_users_test").add(user).then(async ()=>{
            //set_toast("account well created",1);
            await send_code();
            set_state(2);
            set_title("Verification")
        }).catch((err)=>{
            set_toast(err.message,0);
        })
        
        
        
        
    }


    const send_code=async ()=>{
        fetch(`https://assitchape.com/api/psg/send_code.php?code=${code}&email=${user_email}`).then(()=>{
            
       }).catch((err)=>{
            set_toast("error "+err.message,0)
       });
    }

    const re_send_code=async ()=>{
        set_sending_code(true);
        await send_code();
        set_toast("Code resent",1)
        set_sending_code(false);
    }   

    const login=()=>{
        
    }


    const handle_code_change=(e)=>{
        const v=e.target.value;
        set_checking_code(false);
        if(v.length==6){
           // e.target.disabled=true;
           console.log("the code is ",code);
            set_checking_code(true);
            
            if(v!=code){
                set_toast("Invalid code",0);
                return;
            }
            
            if(user_email==""){
                set_toast("No email address is found",0);
                return;
            }

            db.collection("psg_users_test").where("email","==",user_email).get().then((snap)=>{
                if(snap.docs.length==0){
                    set_toast("No email address is found",0);
                }else{
                    const key=snap.docs[0].id;
                    const pw=snap.docs[0].data().password;
                    const un=snap.docs[0].data().username;
                    db.collection("psg_users_test").doc(key).update({verify:true,code},{merge:true}).then(()=>{
                        
                        auth.createUserWithEmailAndPassword(user_email,pw).then(()=>{
                            auth.currentUser.updateProfile({
                                displayName:un
                            }).then(()=>{
                                close();
                            }).catch((err)=>{
                                auth.signOut();
                                set_toast(err.message,0);
                            })
                            
                        }).catch((err)=>{
                            set_toast(err.message,0);
                        })
                    }).catch((err)=>{
                        set_toast(err.message,0);
                    });
                }
            }).catch((err)=>{
                set_toast(err.message,0);
            })


        }
    }
  return (
    <div className="new_login">
        <div className="top">
            <button onClick={close}><ArrowBackIcon /></button>
            <h2>{title}</h2>
        </div>

        <div className="body">
            <div className="top">
                <h2>ProSport.Guru</h2>
                <img src={logo} />
            </div>

            {state==0 && <div className="form" id="form_register">

                <div className="line">
                    <label>First Name</label>
                    <div>
                        <input type="text" id="r_name"/>
                        <PermIdentityIcon style={{color:"gray",marginRight:"0.5rem",fontSize:"1.2rem"}} />
                    </div>
                </div>

                <div className="line">
                    <label>Last Name</label>
                    <div>
                        <input type="text" id="r_lname"/>
                        <PermIdentityIcon style={{color:"gray",marginRight:"0.5rem",fontSize:"1.2rem"}} />
                    </div>
                </div>


                <div className="line">
                    <label>Email</label>
                    <div>
                        <input type="email" id="r_email" />
                        <MailOutlineIcon style={{color:"gray",marginRight:"0.5rem",fontSize:"1.2rem"}} />
                    </div>
                </div>

                <div className="line">
                        <label>Password</label>
                        <div>
                            <input type="password" id="r_password"/>
                            <button style={{
                                display:"flex",
                                alignItems:"center",
                                justifyContent:"center",
                                backgroundColor:"transparent",
                                border:"none",
                                padding:"0",
                                outline:"none",
                            }}
                            >
                               {show_pw==false && <VisibilityIcon  style={{color:"gray",marginRight:"0.5rem",fontSize:"1.2rem"}}/>}
                               {show_pw==true && <VisibilityOffIcon  style={{color:"gray",marginRight:"0.5rem",fontSize:"1.2rem"}}/>} 
                            </button>
                            
                        </div>
                    </div>

                    <div className="line">
                        <button  id="btn_register" onClick={register}>
                            <DoneIcon style={{color:"whitesmoke",fontSize:"1.2rem"}}/>
                                Sing Up 
                        </button>
                    </div>

                    <div className="line line_last">
                        <p>Already signed up ?</p> 
                        <button id="login" onClick={show_login}>Login</button>
                    </div>
            </div>}


            {state==1 &&<div className="form" id="form_login">

               


                <div className="line">
                    <label>Email</label>
                    <div>
                        <input type="email" id="l_email"/>
                        <MailOutlineIcon style={{color:"gray",marginRight:"0.5rem",fontSize:"1.2rem"}} />
                    </div>
                </div>

                <div className="line">
                        <label>Password</label>
                        <div>
                            <input type="password" id="l_password"/>
                            <button style={{
                                display:"flex",
                                alignItems:"center",
                                justifyContent:"center",
                                backgroundColor:"transparent",
                                border:"none",
                                padding:"0",
                                outline:"none",
                            }}
                            >
                               {show_pw==false && <VisibilityIcon  style={{color:"gray",marginRight:"0.5rem",fontSize:"1.2rem"}}/>}
                               {show_pw==true && <VisibilityOffIcon  style={{color:"gray",marginRight:"0.5rem",fontSize:"1.2rem"}}/>} 
                            </button>
                            
                        </div>
                    </div>

                    <div className="line">
                        <button  id="btn_login" onClick={login}>
                            <DoneIcon style={{color:"whitesmoke",fontSize:"1.2rem"}}/>
                                Login 
                        </button>
                    </div>

                    <div className="line line_last">
                        <p>Don't have an account  ?</p> 
                        <button id="login" onClick={show_register}>Sign Up</button>
                    </div>
            </div>}

            {
                state==2 && 
                <div className="form">

                    <p>Please enter the 6-digits code sent to {user_email} </p>
                    
                    <div className="line">
                        <div>
                            <input type="tel" 
                            maxLength={6}
                            onKeyUp={handle_code_change}
                            className="six_digits" autoFocus />
                            {checking_code==true && <CircularProgress size={15} color="secondary" />}
                        </div>
                        
                    </div>

                    <div className="line">
                         
                        <button id="btn_resend" onClick={re_send_code}>
                            {sending_code==false && <RefreshIcon />}
                            {sending_code==true && <CircularProgress size={20} color="secondary" />}
                            Re-send the code</button>
                    </div>
                </div>
            }
            
        </div>

        <ToastContainer
            position="bottom-center"
            autoClose={5000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            />
    </div>
  )
}
