import "../styles/help.scss";
import {useHistory} from "react-router-dom";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import PlaceIcon from '@material-ui/icons/Place';
import EmailIcon from '@material-ui/icons/Email';
import PhoneIcon from '@material-ui/icons/Phone';
const Help=()=>{
    const history=useHistory();
    return(
        <div className="help">
          <div className="top">
                <button onClick={e=>{
                    history.goBack();
                }}>
                    <ArrowBackIcon />
                </button>
                <h2>Help & Contact</h2>
            </div>
            <div className="content">
                <div className="info">
                    <p>For more informations and help, please see our contacts informations below.</p>
                </div>
                
                <div className="line">
                    <PlaceIcon style={{fontSize:"1.2rem"}} />
                    <p>
                        2325 Hurontario Street Suite 315<br />Mississauga ON L51 4K4
                    </p>
                </div>
                
                <div className="line">
                    <EmailIcon style={{fontSize:"1.2rem"}}/>
                    <p>
                        prosportdotguru@gmail.com 
                    </p>
                </div>

                <div className="line">
                    <PhoneIcon style={{fontSize:"1.2rem"}}/>
                    <p>
                        647 243 5111
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Help;