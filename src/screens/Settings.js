import "../styles/settings.scss";
import {useHistory} from "react-router-dom";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {useTransition,animated} from "react-spring";
import {useState,useEffect} from "react";
import {auth} from "../firebase_file";
import {selectUsers,selectUsersStats} from "../features/counterSlice";
import {useSelector,useDispatch} from "react-redux";
import StarBorderIcon from '@material-ui/icons/StarBorder';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import VpnLockIcon from '@material-ui/icons/VpnLock';
import DescriptionIcon from '@material-ui/icons/Description';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import {user_stats} from "../components2/data";

const Settings=()=>{
    const history=useHistory();
    const users=useSelector(selectUsers);
    const us=useSelector(selectUsersStats);

    const [me,set_me]=useState(null);
    const [wp,set_wp]=useState(".000");
    

    useEffect(()=>{
       if(users==null || users.length==0){
           history.replace("/");
           return;
       };
       const res=users.filter((user)=>{
           return user.email==auth?.currentUser?.email;
       })
       if(res.length>0){
           set_me(res[0])
       }

    },[users])

    useEffect(()=>{
        if(us==null) return;
        const {win_per}=user_stats(auth?.currentUser?.email,us);
        set_wp(win_per);
    },[us])

    const [show_page,set_show_page]=useState([1]);
    const page_transition=useTransition(show_page,{
        from:{x:100,y:0,opacity:0},
        enter:{x:0,y:0,opacity:1},
        leave:{}
    })
    const go_to_edit_profile=()=>{
        history.push("/profile-edit");
    }
    return(
   page_transition((style,item)=>{
        if(item){
            return(
                <animated.div className="settings">
                    <div className="top">
                        <button onClick={e=>history.goBack()}>
                            <ArrowBackIcon />
                        </button>
                        <h2>Settings</h2>
                    </div>
                    <div className="body">
                        <div className="top" onClick={go_to_edit_profile}>
                            <div className="left">
                                <img src={me?.photo} />
                                <div>
                                    <p>{me?.username}</p>
                                    <p>{me?.status}</p>
                                    <div>
                                        <StarBorderIcon style={{color:"indianred",fontSize:"1rem"}} />
                                    </div>
                                </div>
                            </div>
                            <div className="right">
                                <div>
                                    <p>{wp}</p>
                                    <p>Win %</p>
                                </div>
                                
                            </div>
                        </div>
                        <div className="items">
                            <div className="item" onClick={e=>{
                                history.push("/coins");
                            }}>
                                <div>
                                    <AttachMoneyIcon
                                    style={{color:"gray"}}
                                    />
                                </div>
                                <div>
                                    <p>Wallets</p>
                                    <p>Deposite, Withdrawall, Winnings.</p>
                                </div>
                            </div>

                            <div className="item" onClick={e=>{
                                history.push("/private-profile");
                            }}>
                                <div>
                                    <VpnLockIcon
                                    style={{color:"gray"}}
                                    />
                                </div>
                                <div>
                                    <p>Membership</p>
                                    <p>Free</p>
                                </div>
                            </div>

                            <div className="item" onClick={e=>{
                                history.push("/terms-conditions");
                            }}>
                                <div>
                                    <DescriptionIcon
                                    style={{color:"gray"}}
                                    />
                                </div>
                                <div>
                                    <p>Terms and Conditions</p>
                                    <p>What are our terms and conditions ?</p>
                                </div>
                            </div>

                            <div className="item" onClick={e=>{
                                history.push("/private-policy");
                            }}>
                                <div>
                                    <VpnKeyIcon
                                    style={{color:"gray"}}
                                    />
                                </div>
                                <div>
                                    <p>Privacy Policy</p>
                                    <p>How do we protect your personnal data ?</p>
                                </div>
                            </div>

                            <div className="item" onClick={e=>{
                                history.push("/help");
                            }}>
                                <div>
                                    <HelpOutlineIcon
                                    style={{color:"gray"}}
                                    />
                                </div>
                                <div>
                                    <p>Help</p>
                                    <p>You can contact us for more informations.</p>
                                </div>
                            </div>

                        </div>

                        <div className="branding">
                            <p>from</p>
                            <p>Prosport.Guru .Inc</p>
                        </div>
                    </div>
                </animated.div>
            )
        }
    })
    
   
    )
}
export default Settings;