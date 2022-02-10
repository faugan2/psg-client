import "../styles/favorite_item.scss";
import {basketball, football, hockey,baseball} from "../components/data";

const FavoriteItem=({favorite,click})=>{
    let mode="MW";
    let type="Heads Up";
    let entry="Free";

    if(favorite.mode=="2"){
        mode="LWS"
    }

    if(favorite.type=="3"){
        type="Sports Booth"
    }

    if(favorite.entry!="0"){
        entry=favorite.entry;
    }
    return (
        <div className="favorite_item" >
            <div className="top">
                <div>
                    {favorite.sport=="6" && <img src={baseball} />}
                    {favorite.sport=="2" && <img src={basketball} />}
                    {favorite.sport=="1" && <img src={football} />}
                    {favorite.sport=="3" && <img src={hockey} />}
                    <div>
                        <p>{favorite?.sport_name}</p>
                        <p>{favorite?.league_name}</p>
                    </div>
                </div>
                <div>
                    <button onClick={click}>
                        Play Public
                    </button>
                    <button>
                        Invite Friends
                    </button>
                </div>
                
               
            </div>
            <div className="bottom">
                <div>
                    <p>{type}</p>
                    <p>Type</p>
                    
                </div>
                <div>
                    
                    <p>{mode}</p>
                    <p>Mode</p>
                </div>
                <div>
                    <p>{favorite.number_game}</p>
                    <p>#Games</p>
                </div>
                <div>
                    
                    <p>{entry}</p>
                    <p>Entry</p>
                </div>
            </div>
        </div>
    )
}

export default FavoriteItem;