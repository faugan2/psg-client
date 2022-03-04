import "../styles/search.scss";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {useHistory} from "react-router-dom";
import {useSelector,useDispatch} from "react-redux";
import {selectUsers,setUserProfile} from "../features/counterSlice";
import {useState,useEffect} from "react";
import SearchUser from "../components2/SearchUser";
import {auth} from "../firebase_file";
import { BottomSheet } from 'react-spring-bottom-sheet'
import Profile from "../components2/UserProfile";

const Search=()=>{
    const dispatch=useDispatch();
    const history=useHistory();
    const users=useSelector(selectUsers);

    const [data,set_data]=useState([]);
    const [data_show,set_data_show]=useState([]);
    const [search,set_search]=useState("");
    const [open_profile,set_open_profile]=useState(false);


    useEffect(()=>{
        if(users==null || users.length==0){
            history.replace("/");
            return;
        } 
        const res=users.filter((item)=>{
            return item.email!=auth?.currentUser.email;
        })
        set_data(res);
        set_data_show(res);
    },[users]);

    useEffect(()=>{
        if(search==""){
            set_data_show(data);
            return;
        }

        const new_search=search.toLowerCase();
        const res=data_show.filter((item)=>{
            return item.username.toLowerCase().indexOf(new_search)>=0;
        })
        set_data_show(res);
    },[search,data])

    const close_profile=()=>{
        set_open_profile(false);
    }

    const click_profile=(email)=>{
        dispatch(setUserProfile(email))
        history.push("/profile");
    }

    return(
        <div className="search">
            <div className="top">
                <button onClick={e=>{
                    history.goBack();
                }}>
                    <ArrowBackIcon />
                </button>
                <input type="text" placeholder="Search by username" autoFocus 
                value={search} 
                onChange={e=>set_search(e.target.value)}
                />
            </div>
            <div className="body">
                {
                    data_show.length==0 && <div className="info">
                            <p>No user found</p>
                        </div>
                }

                {
                    data_show.length>0 && <div className="body_users">
                            {
                                data_show.map((user)=>{
                                    return(
                                        <SearchUser 
                                        info={user} 
                                        key={user.key} 
                                        click={click_profile}
                                        />
                                    )
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
export default Search;