import React from 'react'
import "../styles/joinning_auth_alert.scss";
import PermIdentityIcon from '@material-ui/icons/PermIdentity';

export default function JoinningAuthAlert() {
  return (
    <div className="joinning_auth_alert">
       <div>
           <PermIdentityIcon  />
           <p>Sign Up for an account</p>
           <button>Sign up</button>
       </div>
    </div>
  )
}
