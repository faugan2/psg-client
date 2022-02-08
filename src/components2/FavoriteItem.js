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
        <div className="favorite_item" onClick={click}>
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
                <button>
                    Go Public
                </button>
                <button>
                    Invite
                </button>
               
            </div>
            <div className="bottom">
                <div>
                    <p>Heads Up</p>
                    <p>{type}</p>
                </div>
                <div>
                    <p>MW</p>
                    <p>{mode}</p>
                </div>
                <div>
                    <p>{favorite.number_game}</p>
                    <p>#Games</p>
                </div>
                <div>
                    <p>Free</p>
                    <p>{entry}</p>
                </div>
            </div>
        </div>
    )
}

export default FavoriteItem;