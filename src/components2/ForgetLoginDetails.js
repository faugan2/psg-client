import "../styles/forget_login_details.scss";
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import {useEffect, useState} from "react";
import CloseIcon from '@material-ui/icons/Close';
const ForgetLoginDetails=({click})=>{
    const [alerte,set_alerte]=useState("");
    const [email,set_email]=useState("");
    const recover=(e)=>{
        set_alerte("");
        if(email==""){
            set_alerte("The email is empty");
            return;
        }
        const btn=e.target;
        btn.disabled=true;
        btn.innerHTML="Please wait...";

        setTimeout(()=>{
            btn.disabled=false;
            btn.innerHTML="Recover Now";
            set_alerte("An email is sent to you, please go into your email to get back your password")
        },2000)
    }
    return (
        <div className="forget_login_details">
            
            <h2>Recover your password</h2>
            <p>Please provide your email adresse you used in the registration process</p>

            <div className="line">
                <label>Email</label>
                <div>
                    <input type="email" value={email} onChange={e=>set_email(e.target.value)} />
                    <MailOutlineIcon style={{color:"gray"}} />
                </div>
            </div>

            <div className="line">
                <button onClick={recover}>Recover Now</button>
            </div>

            {alerte!="" && <div className="line">
                <p>{alerte}</p>
            </div>}
            
        </div>
    )
}

export default ForgetLoginDetails;