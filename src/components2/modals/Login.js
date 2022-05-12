import React from 'react'
import "../../styles/login.scss";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from 'react-router-dom';

export default function Login({close}) {
    const history=useHistory();
    const go_back=()=>{
        history.goBack();
    }

  return (
    <div className="new_login">
        <div className="top">
            <button onClick={close}><ArrowBackIcon /></button>
            <h2>Login</h2>
        </div>

        <div className="body">
            body
        </div>
    </div>
  )
}
