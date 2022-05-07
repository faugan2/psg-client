import "../styles/private_profile.scss";
import {useHistory} from "react-router-dom";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {useState,useEffect} from "react";

const PrivateProfile=()=>{
    const history=useHistory();
    const [private_profile,set_private_profile]=useState(false);

    return(
        <div className="private_profile">
            <div className="top">
                <button onClick={e=>{
                    history.goBack();
                }}>
                    <ArrowBackIcon />
                </button>
                <h2>Membership</h2>
            </div>
            <div className="content">
               

                {
                    true==true && <div className="choix">
                    <button className="line">
                        <input type="radio" name="choix" checked />
                        <div>
                            <h2>Free</h2>
                            <p></p>
                        </div>
                    </button>

                    <button className="line">
                        <input type="radio" name="choix" />
                        <div>
                            <h2>Standard</h2>
                            <p>$4.99 / month</p>
                            <p>Receive 50 coins monthly</p>
                        </div>
                    </button>

                    <button className="line">
                        <input type="radio" name="choix" />
                        <div>
                            <h2>Premium</h2>
                            <p>$14.99</p>
                            <p>Receive 150 coins monthly</p>
                        </div>
                    </button>

                   
                </div>
                }

                
                
                

            </div>
        </div>
    )
}
export default PrivateProfile;