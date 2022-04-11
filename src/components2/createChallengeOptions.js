import "../styles/create_challenge_options.scss";
import {useState,useEffect} from "react";
import { useSelector,useDispatch } from "react-redux";
import { selectCreateChallengeOptions,setCreateChallengeOptions } from "../features/counterSlice";

const CreateChallengeOptions=()=>{
   
    const dispatch=useDispatch();

    const options=useSelector(selectCreateChallengeOptions);
    const [type,set_type]=useState(1);
    const [mode,set_mode]=useState(1);
    const [entry,set_entry]=useState(1);
    const [number_game,set_number_game]=useState(1);
    

    useEffect(()=>{
        const inputs=document.querySelectorAll(".line_type input");
        inputs[type-1].click();
        //dispatch(setCreateChallengeOptions({...options,type}));
    },[type])

    useEffect(()=>{
        const inputs=document.querySelectorAll(".line_mode input");
        inputs[mode-1].click();
    },[mode])

    useEffect(()=>{
        const inputs=document.querySelectorAll(".line_entry input");
        inputs[entry-1].click();
    },[entry])

    useEffect(()=>{
        const inputs=document.querySelectorAll(".line_number_game input");
        inputs[number_game-1].click();
    },[number_game]);

    useEffect(()=>{
        set_type(options.type);
        set_mode(options.mode);
        set_entry(options.entry);
     },[options])

     const set_type_change=(id)=>{
         set_type(id)
         dispatch(setCreateChallengeOptions({...options,type:id}));
     }

     const set_mode_change=(id)=>{
         set_mode(id);
         dispatch(setCreateChallengeOptions({...options,mode:id}));
     }

     const set_entry_change=(id)=>{
         set_entry(id);
         dispatch(setCreateChallengeOptions({...options,entry:id}));
     }
     const set_number_game_change=(id)=>{
        set_number_game(id);
        dispatch(setCreateChallengeOptions({...options,number_game:id}))
     }


    return (
        <div className="create_challenge_options">
            <div className="line line_type">
                <h2>Challenge Type</h2>
                <div>
                    <button onClick={e=>set_type_change(1)}>
                        <input type="radio" name="type" defaultChecked /> Heads Up
                    </button>
                    <button  onClick={e=>set_type_change(2)}>
                        <input type="radio" name="type"/> Sports Booth
                    </button>

                     <button  onClick={e=>set_type_change(3)}>
                        <input type="radio" name="type"/> Tournament
                    </button>
                </div>

            </div>
            <div className="line line_mode">
            <h2>Challenge Mode</h2>
                <div>
                    <button onClick={e=>set_mode_change(1)}>
                        <input type="radio" name="mode" defaultChecked/> Most Wins
                    </button>
                    <button onClick={e=>set_mode_change(2)}>
                        <input type="radio" name="mode"/> Longest Winning Streak
                    </button>
                </div>
            </div>
            <div className="line line_entry">
            <h2>Challenge Entry Fees</h2>
                <div>
                    <button onClick={e=>set_entry_change(1)}>
                        <input type="radio" name="entry" defaultChecked/> Free
                    </button>
                    <button onClick={e=>set_entry_change(2)}>
                        <input type="radio" name="entry"/> 1 coins
                    </button>
                    <button onClick={e=>set_entry_change(3)}>
                        <input type="radio" name="entry"/> 2 coins
                    </button>
                    <button onClick={e=>set_entry_change(4)}>
                        <input type="radio" name="entry"/> 5 coins
                    </button>
                </div>
            </div>

            <div className="line line_number_game">
            <h2>Challenge Number of Games</h2>
                <div>
                    <button onClick={e=>set_number_game_change(1)}>
                        <input type="radio" name="number_game" defaultChecked/> 3
                    </button>
                    <button onClick={e=>set_number_game_change(2)}>
                        <input type="radio" name="number_game"/> 5
                    </button>
                    <button onClick={e=>set_number_game_change(3)}>
                        <input type="radio" name="number_game"/> 7
                    </button>
                    <button onClick={e=>set_number_game_change(4)}>
                        <input type="radio" name="number_game"/> 9
                    </button>
                </div>
            </div>

        </div>
    )
}
export default CreateChallengeOptions;