import React,{useState,useEffect} from 'react';
import { useSelector,useDispatch } from 'react-redux';
import {selectInvitedFriend,selectUsers,selectFollow,setInvitedFriends} from '../features/counterSlice';
import {auth } from '../firebase_file';
import PublicIcon from '@material-ui/icons/Public';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import "./listfriend.scss";

const ListFriends=()=>{
	
	const fi=useSelector(selectInvitedFriend);
	const users=useSelector(selectUsers);
    const follow=useSelector(selectFollow);
	const [my_club,set_my_club]=useState([]);
	const [public_users,set_public_users]=useState([]);
	
	const dispatch=useDispatch();
	
	useEffect(()=>{
		const res=follow.filter((item,i)=>{
			const u=item.user;
			const f=item.follow;
			return u==auth?.currentUser.email;
		})
		
		const res2=res.map((item,i)=>{
			return item.follow;
		});

		console.log("i am following",res2);
		
		const res3=users.filter((item,i)=>{
			return res2.indexOf(item.email)>=0 && 
			item.email!=auth?.currentUser.email &&
			fi.indexOf(item.email)<0;
		})

		const res4=users.filter((item,i)=>{
			return res2.indexOf(item.email)<0 && 
			item.email!=auth?.currentUser.email &&
			fi.indexOf(item.email)<0
		})
		
		set_my_club(res3);
		set_public_users(res4);
		
		//console.table(res3)
	},[follow,users,fi])
	
	
	const invite_user=(e,user,index)=>{
		e.stopPropagation();
		const invited=[...fi];
		invited.push(user.email);
		dispatch(setInvitedFriends(invited));
		
	}
	
	const [show_club,set_show_club]=useState(true);

	const show_my_club=(e)=>{
		e.stopPropagation();
		set_show_club(true);
		const btns=document.querySelectorAll(".btn_club_public");
		for(let i=0; i<btns.length; i++){
			btns[i].classList.remove("active");
		}
		btns[0].classList.add("active");
	

	}

	const show_public=(e)=>{
		e.stopPropagation();
		set_show_club(false);
		const btns=document.querySelectorAll(".btn_club_public");
		for(let i=0; i<btns.length; i++){
			btns[i].classList.remove("active");
		}
		btns[1].classList.add("active");
		
	}
	return(
		<div style={{
			padding:"1rem",
			minHeight:"50vh",
			maxHeight:"60vh",
			overflowY:"auto",

		}}>

		

		
		<div style={{
			display:"flex",
			alignItems:"center",
			justifyContent:"space-between",
			gap:"1rem",
		}}>
			
			<button 
			className="btn_club_public active"
			
			onClick={show_my_club}
			>
				<LockOpenIcon />
				<p>My Club</p>
			</button>
			<button 
			className="btn_club_public"
			onClick={show_public}>
				<PublicIcon />
				<p>Public Directory</p>
				</button>
		</div>

		{
			show_club==true ?
			<div> 
				<div  style={{
					display:"flex",
					flexWrap:"wrap",
					gap:"1rem",
					marginTop:"1rem",
	
				}}>
				{
				my_club.map((user,i)=>{
					let username=user.username;
					
					return (
						<div key={i} style={{
							display:"flex",
							flexDirection:"column",
							alignItems:"center",
							justifyContent:"center",
						}}
						onClick={e=>invite_user(e,user,1)}
						>
							<img src={user.photo} style={{width:"2.5rem",height:"2.5rem",borderRadius:"50%"}}/>
							<p style={{
								fontSize:"0.7rem",
								width:"60px",
								whiteSpace:"nowrap",
								overflow:"hidden",
								textOverflow: "ellipsis",
								textAlign:"center"
							}}>{username}</p>
						</div>
					)
				})
			}
				</div>
				{
				my_club.length==0 && 
					<div className="alerte" style={{
						display:"flex",
						alignItems:"center",
						justifyContent:"center"
					}}>
						<p>No user found</p>
						
					</div>
				}
				</div>: 
				<div>
				<div style={{
					display:"flex",
					flexWrap:"wrap",
					gap:"1rem",
					marginTop:"1rem",
	
				}}>
					{
				public_users.map((user,i)=>{
					let username=user.username;
					
					return (
						<div key={i} style={{
							display:"flex",
							flexDirection:"column",
							alignItems:"center",
							justifyContent:"center",
						}}
						onClick={e=>invite_user(e,user,2)}
						>
							<img src={user.photo} style={{width:"2.5rem",height:"2.5rem",borderRadius:"50%"}}/>
							<p style={{
								fontSize:"0.7rem",
								width:"60px",
								whiteSpace:"nowrap",
								overflow:"hidden",
								textOverflow: "ellipsis",
								textAlign:"center"
							}}>{username}</p>
						</div>
					)
				})
				}
				</div>
				{
				public_users.length==0 && 
					<div className="alerte" style={{
						display:"flex",
						alignItems:"center",
						justifyContent:"center"
					}}>
						<p>No user found</p>
						
					</div>
				}
				</div>
		}
		
			<div style={{
				display:"flex",
				flexWrap:"wrap",
				gap:"1rem",
				marginTop:"1rem",

			}}
			
			>
			
			</div>
			
			
			
			
		
		</div>
	)
}

export default ListFriends;