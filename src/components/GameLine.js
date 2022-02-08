import React from 'react'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import GroupIcon from '@material-ui/icons/Group';
export default function Gameline(props) {
     const {multiple,dates,invited,type,go_to_tournament,name,league_name,icon_name,nb_game,fee,winning,str_player,show_play_btn}=props;

    
    return (
        <div style={{marginBottom:"1.5rem"}} 
                       className="a_game_line" 
                       onClick={go_to_tournament}>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                                <div style={{display:"flex",alignItems:"center"}}>
                                    {icon_name}
                                    <div style={{display:"flex",flexDirection:"column",marginLeft:"1rem"}}>
                                        <p style={{
                                            fontWeight:"bold",
                                            fontSize:"0.7rem",
                                           
                                            width:"200px",
                                            whiteSpace:"nowrap",
                                            textOverflow:"ellipsis",
                                            overflow: "hidden",
                                            }}>{name}</p>
                                        <p style={{fontSize:"0.7rem",color:"gray"}}>{league_name}</p>
                                    </div>
                                   
                                </div>
                               {show_play_btn==true && <div>
                                    <button style={{
                                        
                                        border:"none",
                                        outline:"none",
                                        fontWeight:"bold",
                                        backgroundColor:"rgba(0,0,0,0.1)",
                                        display:"flex",
                                        justifyContent:"flex-end",
                                        backgroundColor:"whitesmoke"

                                    }}
                                    onClick={go_to_tournament}
                                    
                                    >
                                       
                                        <MoreHorizIcon/>
                                    </button>
                                </div>}

                                
                            </div>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"0.5rem"}}>
                                <div className="game_sub_line">
                                    <p>{nb_game}</p>
                                    <p>#Games</p>
                                </div>
                                <div className="game_sub_line">
                                    <p>{fee=="0"?"Free":fee}</p>
                                    <p>Entry</p>
                                </div>
                                <div className="game_sub_line">
                                    <p>{winning}</p>
                                    <p>Winning</p>
                                </div>
                                <div className="game_sub_line">
                                    <p>{str_player}</p>
                                    <p>Players</p>
                                </div>
                            </div>

                            {multiple==true && 
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"0.5rem"}}>
                                {
                                    dates.map((date)=>{
                                        return <div className="game_sub_line" >
                                            <p>{date}</p>
                                            <p>Date</p>
                                        </div>
                                    })
                                }
                            </div>
                            }
                       </div>
    )
}
