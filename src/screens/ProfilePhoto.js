import "../styles/profile_photo.scss";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {useEffect, useState,useRef} from "react";
import {useHistory} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectRegisterInfo} from "../features/counterSlice";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import {auth,db, storage} from '../firebase_file'
const ProfilePhoto=()=>{
    const [alerte,set_alerte]=useState("")
    const [url,set_url]=useState(null);
    
    const ref_photo=useRef(null);
    
    const history=useHistory();
    const info=useSelector(selectRegisterInfo);

    const go_back=()=>{
        history.goBack();
    }
    const get_image=(e)=>{
        ref_photo.current.click();
    }

    const photo_changed=()=>{
        const files=ref_photo.current.files;
        if(files.length==0){
            set_alerte("No file is selected");
            return;
        }

        const file=files[0];

        const reader=new FileReader();
        reader.addEventListener("load",()=>{
            set_url(reader.result);
        })

        reader.readAsDataURL(file);
    }

    const finish=(e)=>{
        set_alerte("");
        if(url==null){
            set_alerte("No file is selected");
            return;
        }

        
        const btn=e.target;
        btn.disabled=true;
        btn.innerHTML="Please wait...";
        const file=ref_photo.current.files[0];
        const filename=file.name;
        const ref=storage.ref("profiles/"+filename);
        ref.put(file).then(()=>{
            ref.getDownloadURL().then((url)=>{
                const user={...info,photo:url};
                auth.createUserWithEmailAndPassword(user.email,user.password).then(()=>{
                    auth.currentUser.updateProfile({
                        displayName:user.username,
                        photoURL:url,
                    })

                    db.collection("psg_users").add(user).then(()=>{
                        history.replace("/");
                    }).catch((err)=>{
                        auth.currentUser.delete();
                        auth.signOut();
                        btn.disabled=false;
                        btn.innerHTML="Finish";
                        set_alerte(err.message);
                    })
                }).catch((err)=>{
                    btn.disabled=false;
                    btn.innerHTML="Finish";
                    set_alerte(err.message);
                })
            }).catch((err)=>{
                btn.disabled=false;
                btn.innerHTML="Finish";
                set_alerte(err.message);
            })
        }).catch((err)=>{
            btn.disabled=false;
            btn.innerHTML="Finish";
            set_alerte(err.message);

        })

    }
    return(
        <div className="profile_photo">
            <div className="head">
                <button onClick={go_back}>
                    <ArrowBackIcon />
                </button>
                <h2>Profile Picture</h2>
            </div>
            <div className="body">
                <h2>Hi {info?.username},</h2>
                <p>
                    Please set up your profile picture
                </p>
                <button 
                onClick={get_image}
                className="zone_image">
                    {url==null && <AccountCircleIcon style={{fontSize:"10rem",color:"gray"}}/>}
                    {url!=null && 
                    <img src={url} />
                    }
                    <CameraAltIcon style={{
                        fontSize:"2rem",
                        position:"absolute",
                        right:"1rem",
                        bottom:"1rem",
                        color:"black",
                        }} />
                </button>
                
                <button className="btn_finish" onClick={finish}>
                    Finish
                </button>

                {alerte != "" && <p className="alerte">{alerte}</p>}
            </div>

            <input type="file" accept="image/*" ref={ref_photo} style={{display:"none"}} onChange={photo_changed}/>
        </div>
    );
}

export default ProfilePhoto;