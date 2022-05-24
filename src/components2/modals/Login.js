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

export default function Login({close,done}) {
    const history=useHistory();

    const [show_pw,set_show_pw]=useState(false);
    const [title,set_title]=useState("Sign up");
    const [state,set_state]=useState(0);
    const [user_email,set_user_email]=useState("");
    const [code,set_code]=useState("");
    const [sending_code,set_sending_code]=useState(false);
    const [checking_code,set_checking_code]=useState(false);
    const [registration_progressing,set_registration_progressing]=useState(false);
    const [registration,set_registration]=useState(true);

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
        set_registration_progressing(true);
        set_registration(true);


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

        db.collection("psg_users").add(user).then(async ()=>{
            //set_toast("account well created",1);
            await send_code();
            set_state(2);
            set_registration_progressing(false);
            set_title("Verification")
        }).catch((err)=>{
            set_toast(err.message,0);
            set_registration_progressing(false);
        })
        
        
        
        
    }


    const send_code=async ()=>{
        fetch(`https://assitchape.com/api/psg/send_code.php?code=${code}&email=${user_email}`).then(()=>{
            
       }).catch((err)=>{
            set_toast("error "+err.message,0)
           
       });
    }

    const re_send_code=async ()=>{
        set_checking_code(false);
        set_sending_code(true);
        await send_code();
        set_toast("Code resent",1)
        set_sending_code(false);
        set_checking_code(false);
        document.querySelector(".six_digits").disabled=false;
        document.querySelector(".six_digits").value="";
        
    }   

    const login=()=>{
        set_registration_progressing(false);
        set_registration(false);
        const email=document.querySelector("#l_email").value;
        const password=document.querySelector("#l_password").value;

        if(email==""){
            set_toast("Please enter your email address",0);
            return;
        }
        if(password==""){
            set_toast("Please enter your password",0);
            return;
        }
        if(password.length<6){
            set_toast("Your password is too short",0);
            return;
        }

        set_user_email(email);
        set_registration_progressing(true);

        db.collection("psg_users")
        .where("email","==",email)
        .where("password","==",password)
        .get()
        .then(async (snap)=>{
            if(snap.docs.length==0){
                set_toast("Your login details are not correct",0);
                set_registration_progressing(false);
                return;
            }

            const key=snap.docs[0].id;
            const verify=snap.docs[0].data().verify;

            if(verify==undefined || verify==false){
                console.log("we must send the code cause ",verify)
                await send_code()
                set_state(2);
            }else{
                await auth.signInWithEmailAndPassword(email,password)
                close();
                done();
                
            }
            

        }).catch((err)=>{
            set_toast(err.message,0);
        })
        //console.log(email,password);
    }


    const handle_code_change=(e)=>{
        const v=e.target.value;
        
        set_checking_code(false);
        if(v.length==6){
           e.target.disabled=true;
           //console.log("the code is ",code);
            set_checking_code(true);
            
            if(v!=code){
                set_toast("Invalid code",0);
                e.target.disabled=false;
                set_checking_code(false);
                return;
            }
            
            if(user_email==""){
                set_toast("No email address is found",0);
                e.target.disabled=false;
                set_checking_code(false);
                return;
            }

            db.collection("psg_users").where("email","==",user_email).get().then((snap)=>{
                if(snap.docs.length==0){
                    set_toast("No email address is found",0);
                    set_checking_code(false);
                    e.target.disabled=false;
                }else{
                    const key=snap.docs[0].id;
                    const pw=snap.docs[0].data().password;
                    const un=snap.docs[0].data().username;
                    db.collection("psg_users").doc(key).update({verify:true,code},{merge:true}).then(()=>{
                        
                        if(registration==true){
                            auth.createUserWithEmailAndPassword(user_email,pw).then(()=>{
                                auth.currentUser.updateProfile({
                                    displayName:un
                                }).then(()=>{
                                    close();
                                }).catch((err)=>{
                                    auth.signOut();
                                    set_toast(err.message,0);
                                    set_checking_code(false);
                                    e.target.disabled=false;
                                    
                                })
                                
                            }).catch((err)=>{
                                set_toast(err.message,0);
                                set_checking_code(false);
                                e.target.disabled=false;
                            })
                        }else{
                            auth.signInWithEmailAndPassword(user_email,pw).then(()=>{
                                close();
                            }).catch((err)=>{
                                auth.signOut();
                                set_toast(err.message,0);
                                set_checking_code(false);
                                e.target.disabled=false;
                            })
                        }
                        

                    }).catch((err)=>{
                        set_toast(err.message,0);
                        set_checking_code(false);
                        e.target.disabled=false;
                    });
                }
            }).catch((err)=>{
                set_toast(err.message,0);
                set_checking_code(false);
                e.target.disabled=false;
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
                            {registration_progressing==false &&<DoneIcon style={{color:"whitesmoke",fontSize:"1.2rem"}}/>}
                            {registration_progressing==true && <CircularProgress size={15} color="secondary" />}
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
                            {registration_progressing==false && <DoneIcon style={{color:"whitesmoke",fontSize:"1.2rem"}}/>}
                            {registration_progressing==true && <CircularProgress size={15} color="secondary" />}
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
