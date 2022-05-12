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

import { ToastContainer } from 'react-toastify';

import {set_toast} from "../data";

export default function Login({close}) {
    const history=useHistory();

    const [show_pw,set_show_pw]=useState(false);
    const [title,set_title]=useState("Sign up");
    const [state,set_state]=useState(0);

    const show_login=()=>{
        set_state(1);
        set_title("Login");
    }

    const show_register=()=>{
        set_state(0);
        set_title("Sign up");
    }


    const register=()=>{
        const name=document.querySelector("#r_name").value;
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
            set_toast("please create a password",0);
            return;
        }
        
        
    }

    const login=()=>{
        
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
                    <label>Name</label>
                    <div>
                        <input type="text" id="r_name"/>
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
