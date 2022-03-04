import "../styles/my_club.scss";
import {useHistory} from "react-router-dom";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useSelector,useDispatch } from "react-redux";
import { selectUserProfile,selectUsers, selectFollow,setUserProfile} from "../features/counterSlice";
import {useState,useEffect} from "react";
import {auth} from "../firebase_file";
import SearchUser from "../components2/SearchUser";
import { BottomSheet } from 'react-spring-bottom-sheet'
import Profile from "../components2/UserProfile";


const MyClub=()=>{
    const history=useHistory();
    const dispatch=useDispatch();

    const follow=useSelector(selectFollow);
    const users=useSelector(selectUsers);

    const [data,set_data]=useState([]);
    const [data_show,set_data_show]=useState([]);
    const [open_profile,set_open_profile]=useState(false);
    
    const close_profile=()=>{
        set_open_profile(false);
    }

    useEffect(()=>{
        if(follow==null || users==null) return;

        const res=follow.filter((item)=>{
            return item.user==auth?.currentUser?.email;
        })
        const emails=res.map((item)=>{
            return item.follow;
        })

        const res2=users.filter((item)=>{
            return emails.indexOf(item.email)>=0;
        })

        set_data(res2);
        set_data_show(res2);

    },[follow,users])
    const go_to_profile=(email)=>{
        dispatch(setUserProfile(email));
        history.push("/profile");
    }
    return(
        <div className="my_club">
            <div className="top">
                <button onClick={e=>{
                    history.goBack();
                }}>
                    <ArrowBackIcon />
                </button>
                <h2>My Club</h2>
            </div>
            <div className="content">
                {
                    data_show.length==0 && 
                    <div className="info">
                        <p>No data found</p>
                    </div>
                }
                {
                    data_show.length>0 && 

                    <div className="club_users">
                        {
                            data_show.map((user)=>{
                                return <SearchUser 
                                    info={user}
                                    key={user.key}
                                    click={go_to_profile.bind(this,user.email)}
                                />
                            })
                        }
                    </div>
                }
            </div>

            <BottomSheet open={open_profile}>
                <Profile click={close_profile}/>
            </BottomSheet>


        </div>
    )
}
export default MyClub;