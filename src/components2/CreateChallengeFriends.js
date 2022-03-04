import "../styles/create_challenge_friends.scss";
import SearchIcon from '@material-ui/icons/Search';
import {useSelector,useDispatch} from "react-redux";
import {selectUsers,selectCreateChallengeOptions,setCreateChallengeOptions} from "../features/counterSlice";
import {useState,useEffect} from "react";
import {auth} from "../firebase_file";

const CreateChallengeFriends=()=>{
    const dispatch=useDispatch();

    const [data,set_data]=useState(null);
    const [data_show,set_data_show]=useState([]);
    const [search,set_search]=useState("");

    const users=useSelector(selectUsers);
    const options=useSelector(selectCreateChallengeOptions);


    useEffect(()=>{
        console.log("here we go ")
        if(users==null ) return;
        const res=users.filter((item)=>{
            console.log("the email",item.email)
            return item.email!=auth?.currentUser.email;
        })
        set_data(res);
        set_data_show(res);
    },[users])

    useEffect(()=>{
        if(search==""){
            set_data_show(users);
            return;
        }

        const res=users.filter((item)=>{
            return item.username.toLowerCase().indexOf(search.toLowerCase())>=0
        })

        set_data_show(res);

        console.log("the search is ",search);
    },[search])

    const pick_user=(key)=>{
        const input=document.getElementById(`${key}`);
        const btn=document.getElementById("btn_"+key);
        
        console.log(btn);
        if(input.checked==true){
            input.checked=false;
            if(btn!=null && btn!=undefined){
                btn.style.border="1px solid silver";
            }
        }else{
            input.checked=true;
            if(btn!=null && btn!=undefined){
                btn.style.border="1px solid black";
            }
        }
        let ou=options.users;
        let old_users=[];
    
        if(ou==undefined){
            old_users=[];
        }else{
            old_users=[...ou];
        }
        
        if(input.checked){
            console.log("checked");
            
            old_users.push(key);
            dispatch(setCreateChallengeOptions({...options,users:old_users}))
        }else{
            console.log("unchecked")
            
            const res=old_users.filter((u)=>{
                return u!=key;
            })
            dispatch(setCreateChallengeOptions({...options,users:res}))
        }
    }

    useEffect(()=>{
        setTimeout(()=>{
            const u=options.users;
            if(u!=undefined){
                for(var i=0;i<u.length; i++){
                    const input=document.getElementById(u[i]);
                    const btn=document.getElementById("btn_"+u[i]);
                   
                    if(input!=null ){
                        input.checked=true;
                    }

                    if(btn!=null && btn!=undefined){
                        btn.style.border="1px solid black";
                    }
                    //document.querySelector("#"+u[i]).checked=true;
                }
            }
           
        },500)
        
    },[options])
    return(
        <div className="create_challenge_friends">
            <div className="search_zone">
                <SearchIcon style={{fontSize:"1.2rem",color:"whitesmoke"}} />
                <input type="text" placeholder="Search by username" 
                onChange={e=>set_search(e.target.value)}
                value={search}/>
            </div>

            <div className="friends_content">
                {
                    data_show==null && <div className="info">
                            <p>No user found</p>
                        </div>
                }

                {
                    data_show!=null && 
                        <div className="users">
                            {
                                data_show.map((user)=>{
                                    return(
                                        <button key={user.key} id={"btn_"+user.key} className="user" 
                                        onClick={pick_user.bind(this,user.key)}>
                                            <img src={user.photo} />
                                            <p>{user.username}</p>
                                            <input type="checkbox" id={user.key} disabled style={{opacity:0}}/>
                                        </button>
                                    );
                                })
                            }
                        </div>
                }
            </div>
        </div>
    );
}

export default CreateChallengeFriends;