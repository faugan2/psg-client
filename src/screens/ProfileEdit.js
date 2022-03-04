import "../styles/profile_edit.scss";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {useHistory} from "react-router-dom";
import {auth,db,storage} from "../firebase_file";
import {useState,useEffect,useRef} from "react";
import {useSelector,useDispatch} from "react-redux";
import {selectUsers} from "../features/counterSlice";
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import CircularProgress from '@material-ui/core/CircularProgress';
import PersonIcon from '@material-ui/icons/Person';
import EditIcon from '@material-ui/icons/Edit';
import { BottomSheet } from 'react-spring-bottom-sheet'
import EditUserName from "../components2/EditUserName";


const ProfileEdit=()=>{
    const history=useHistory();
    const users=useSelector(selectUsers);

    const [me,set_me]=useState(null);
    const [changing_photo,set_changing_photo]=useState(false);
    const [open_edit_username,set_open_edit_username]=useState(false);

    const close_edit_username=()=>{
        set_open_edit_username(false);
    }

    const ref_file=useRef(null);

    useEffect(()=>{
        if(auth==null || users==null) return;
        const email=auth?.currentUser?.email;
        const res=users.filter((item)=>{
            return item.email==email;
        })

        if(res.length>0){
            set_me(res[0]);
        }
    },[users,auth])
    const pick_photo=()=>{
        ref_file.current.click();
    }
    const photo_changed=(e)=>{
        const files=e.target.files;
       if(files.length>0){
           const file=files[0];
           const name=file.name;
           const ref_storage=storage.ref("profiles/"+name);
           set_changing_photo(true)
           ref_storage.put(file).then(()=>{
               
                ref_storage.getDownloadURL().then((url)=>{
                    set_changing_photo(false)
                    db.collection("psg_users").doc(me?.key)
                    .update({photo:url},{merge:true}).then(()=>{
                        set_changing_photo(false)
                    }).catch((err)=>{
                        set_changing_photo(false)
                    })
                }).catch((err)=>{
                    set_changing_photo(false)
                })
           }).catch((err)=>{
               set_changing_photo(false)
           })
       }
    }

    const handle_edit_username=()=>{
        set_open_edit_username(true)
    }
    return(
        <div className="profile_edit">
            <div className="top">
                <button onClick={e=>{
                    history.goBack();
                }}>
                    <ArrowBackIcon />
                </button>
                <h2>Edit Profile</h2>
            </div>
            <div className="content">
                <div className="top" >
                    <img src={me?.photo} />
                    <button onClick={pick_photo}>
                        <CameraAltIcon style={{fontSize:"1.5rem"}}/>
                    </button>

                    {changing_photo==true && <div>
                        <CircularProgress size={15} style={{color:"white"}} />
                    </div>}

                    <input 
                    type="file" 
                    ref={ref_file}  
                    style={{display:"none"}}
                    onChange={photo_changed}
                    accept="image/*"
                    />

                </div>
                <div className="form">
                    <div className="line">
                        <PersonIcon />
                        <div>
                            <p>Name</p>
                            <p>{me?.username}</p>
                        </div>
                        <button onClick={handle_edit_username}>
                            <EditIcon />
                        </button>

                        <p className="info">
                            This name will be visible for all users.
                        </p>
                    </div>
                </div>
            </div>

            <BottomSheet open={open_edit_username}>
                    <EditUserName click={close_edit_username}/>
            </BottomSheet>
        </div>
    )
}

export default ProfileEdit;