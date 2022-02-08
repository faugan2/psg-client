import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { selectScreenHeight, setActiveTab, setPage, setRegistration, setScreenHeight } from "../features/counterSlice";
import { auth ,db} from "../firebase_file";
import logo from "./img/logo.png";
import { TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import firebase from "firebase";
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles=makeStyles({
    input:{
        color:"white"
    }
});
const Login=()=>{
    const dispatch=useDispatch();
    const history=useHistory();
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [loading,setLoading]=useState(false);
    const [alerte,setAlerte]=useState("");

    const login=async (e)=>{
   
        const btn=e.target;
        btn.disabled=true;
        btn.style.opacity="0.6";
        set_login_progress(true);
        var provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider).then(async (res)=>{
            const email=res.user.email;
            const uid=res.user.uid;
            const get=await db.collection("psg_users").where("email","==",email).get();
            btn.disabled=false;
            btn.style.opacity="1";
            set_login_progress(false);
            if(get.docs.length>0){
               history.replace("/");
            }else{
                alert("Login informations are incorrect");
                await auth.currentUser.delete();
                history.replace("/");
            }
            
        }).catch((err)=>{
            btn.disabled=false;
            btn.style.opacity="1";
            set_login_progress(false);
            alert(err.message)
        })
    }

    const signin=()=>{
        dispatch(setPage(2));
        history.push("/register");
    }

    useEffect(()=>{
        window.addEventListener('resize', handle_resize_window, true);
        return ()=>{
            //console.log("ok")
            window.removeEventListener("resize",handle_resize_window);
        }
    },[])

    const handle_resize_window=(event)=>{
        const height=window.screen.height
        dispatch(setScreenHeight(height));
       
    }
    const go_to_terms=()=>{
		//history.push("/terms");
	}
    const sign_up=async (e)=>{
        var provider = new firebase.auth.GoogleAuthProvider();
        const btn=e.target;

        set_sign_up_progress(true);
        btn.disabled=true;
        btn.style.opacity="0.6";
        console.log("signing up");

        try{
            const res=await auth.signInWithPopup(provider);
            console.log("we got something");
            const email=res.user.email;
            const get=await db.collection("psg_users").where("email","==",email).get();
            if(get.docs.length>0){
                alert("You can't create a new account with this email adress")
                auth.signOut();
                set_sign_up_progress(false);
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
                set_sign_up_progress(false);
                btn.disabled=false;
                btn.style.opacity="1";
                history.replace("/")
            }
        }catch(err){
            console.log("err=",err.message,err.type);
            set_sign_up_progress(false);
            btn.disabled=false;
            btn.style.opacity="1";
            alert(err.message)
        }

       
        
    }

    const [login_progress,set_login_progress]=useState(false);
    const [sign_up_progress,set_sign_up_progress]=useState(false);

    const styles=useStyles();
    return(
        <div className="login" style={{position:"relative"}}>
            <img src={logo} alt="Logo" />
            <h4>Login to Start</h4>
            <p className="login_text">Start earning money now with prosportguru.
			Play with your freinds and challenge them 
                and have fun.
            </p>
			<div style={{
				
				width:"100%",
				display:"flex",
				flexDirection:"column",
				alignItems:"center",
				marginTop:"2rem",
				
			}}>
            <button className="login_btn" onClick={login}>
            <svg aria-hidden="true" className="native svg-icon iconGoogle" 
            width="18" height="18" viewBox="0 0 18 18">
                <path d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18Z" fill="#4285F4"></path><path d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17Z" fill="#34A853"></path>
                <path d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07Z" fill="#FBBC05"></path>
                <path d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.3Z" fill="#EA4335"></path>
                </svg>
                Login with GOOGLE 
                {login_progress && <CircularProgress style={{width:"18px",height:"18px"}}/>}
            </button>
			
            <p style={{
				marginTop:"4rem",
				fontSize:"0.7rem",
				fontWeight:"bold",
				marginBottom:"1rem",
			}}>
				Don't have an account yet ?
			</p>

            <button className="sign_up_btn" onClick={sign_up}>
            <svg aria-hidden="true" className="native svg-icon iconGoogle" 
            width="18" height="18" viewBox="0 0 18 18">
                <path d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18Z" fill="#4285F4"></path><path d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17Z" fill="#34A853"></path><path d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07Z" fill="#FBBC05"></path><path d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.3Z" fill="#EA4335"></path></svg>
                
                Sign Up with GOOGLE
                {sign_up_progress && <CircularProgress style={{width:"18px",height:"18px"}}/>}
            </button>
			
			<div 
				onClick={go_to_terms}
			style={{
				fontSize:"0.7rem",
				marginTop:"1.5rem",
				display:"flex",
				flexDirection:"column",
				alignItems:"center",
				cursor:"pointer",
			}}>
				<p>By logging in, you agree to our</p>
				<p style={{
					color:"indianred",
					fontWeight:"bold",
				}}>Terms of use and Privacy Policy</p>
			</div>
			
			</div>

            <p className="powered_text" style={{
				position:"fixed",
				bottom:"1rem",
				fontSize:"0.7rem"
			}}>Powered by <br/>ProSport Guru Inc.</p>

            
        </div>
    );
}



export default Login;