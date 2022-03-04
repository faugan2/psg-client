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
                <h2>Private profile</h2>
            </div>
            <div className="content">
               

                {
                    private_profile==true && <div className="choix">
                    <button className="line">
                        <input type="radio" name="choix"  />
                        <div>
                            <h2>1 Month</h2>
                            <p>$10</p>
                        </div>
                    </button>

                    <button className="line">
                        <input type="radio" name="choix" />
                        <div>
                            <h2>3 Months</h2>
                            <p>$29</p>
                        </div>
                    </button>

                    <button className="line">
                        <input type="radio" name="choix" />
                        <div>
                            <h2>6 Months</h2>
                            <p>$50</p>
                        </div>
                    </button>

                    <button className="line">
                        <input type="radio" name="choix" />
                        <div>
                            <h2>12 Months</h2>
                            <p>$100</p>
                        </div>
                    </button>
                </div>
                }

                {
                    private_profile==false && 

                    <div className="public">
                        <p>
                            Your profile is currently public. It means that your profile will be 
                            visible to all users of ProSport.Guru. 
                        </p>
                        <h2>Do you want to be invisible to users ?</h2>
                        <button onClick={e=>set_private_profile(true)}>GO PRIVATE NOW</button>
                    </div>
                }
                
                

            </div>
        </div>
    )
}
export default PrivateProfile;