import "../styles/league.scss";
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import {baseball,basketball,hockey,football} from "../components/data";

const League=({league,click})=>{
    const name=league.name;
    const id=league.id;
    return (
        <button className="league" onClick={click}>
           {id=="6" && <img src={baseball} />}
           {id=="2" && <img src={basketball} />}
           {id=="1" && <img src={football} />}
           {id=="3" && <img src={hockey} />}
           <p>{name}</p>
           <div>
               <ArrowForwardIcon />
           </div>
        </button>
    )
}

export default League;