import React, { useEffect, useState } from 'react';
import "./App.css";

import { useSelector } from 'react-redux';
import { selectPage } from './features/counterSlice';

import Splash from "./screens/Splash";
//import Login from "./components/Login";
import Main from "./screens/Main";
//import SignIn from "./components/SignIn";
//import PlayerPicks from "./components/PlayerPicks";

//import ChallengeContent from "./components/ChallengeContent";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
/*
import Join from './components/Join';
import PlayerProfile from './components/PlayerProfile';
import ResumeBuyPick from './components/ResumeBuyPick';
import StartPlaying from './components/StartPlaying';
import BoughtPicks from './components/BoughtPicks';
import ProfileEdit from "./components/ProfileEdit";
import Followers from "./components/Followers";
import Profile from "./components/Profile";
import LobbyScreen from "./components/LobbyScreen";
import ChallengeFriend  from './components/ChallengeFriend';
import StartGame from "./components/StartGame";
import Wallet from './components/Wallet';
import Subscription from "./components/Subscription";
import Terms from "./components/Terms";
import Debug from "./Debug.js";
import Today from "./components/TodaysGame";
import Lockerroom from "./components/LockerRoom";
import Trophyroom from "./components/TrophyRoom";
import History from "./components/History";*/

import Login2 from "./screens/Login2";
import SignUp from "./screens/SignUp";
import ProfilePhoto from "./screens/ProfilePhoto";
import Games from "./screens/Games";
import GameLines from "./screens/GameLines";
import LeaguePage from "./screens/LeaguePage";
import Search from "./screens/Search";
import Settings from "./screens/Settings";
import ProfileEdit from "./screens/ProfileEdit";
import Coins from "./screens/Coins";
import MyClub from "./screens/MyClub";
import Chat from "./screens/Chat";
import Profile from "./screens/Profile";
import PrivateProfile from "./screens/PrivateProfile";
import TermsConditions from "./screens/TermsConditions";
import PrivatePolicy from "./screens/PrivatePolicy";
import Help from "./screens/Help";
import Debug from "./screens/Debug";
import Main2 from "./screens/Main2";

import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [page,setPage]=useState(0);


 const p=useSelector(selectPage);
  useEffect(()=>{
    setPage(p);
  },[p])



  return (
    <Router>
        <Switch>
          <Route path="/" exact>
            <Splash />
          </Route>

         

          <Route path="/login2">
            <Login2 /> 
          </Route>

          <Route path="/sign-up">
            <SignUp /> 
          </Route>

          <Route path="/profile-photo">
            <ProfilePhoto /> 
          </Route>

          {/*<Route path="/register">
            <SignIn />
  </Route>*/}

          <Route path="/games">
            <Games />
          </Route>

          <Route path="/game-lines">
            <GameLines />
          </Route>

          <Route path="/league-page">
            <LeaguePage />
          </Route>


          <Route path="/main">
            <Main />
          </Route>

          <Route path="/search">
            <Search />
          </Route>

          <Route path="/settings">
            <Settings />
          </Route>

          <Route path="/profile-edit">
            <ProfileEdit />
          </Route>

          <Route path="/coins">
            <Coins />
          </Route>

          <Route path="/my-club">
            <MyClub />
          </Route>

          <Route path="/chat">
            <Chat />
          </Route>

          <Route path="/profile">
            <Profile />
          </Route>

          <Route path="/private-profile">
            <PrivateProfile />
          </Route>

          <Route path="/terms-conditions">
            <TermsConditions />
          </Route>

          <Route path="/private-policy">
            <PrivatePolicy />
          </Route>

          <Route path="/help">
            <Help />
          </Route>

          <Route path="/debug">
            <Debug />
          </Route>

          <Route path="/main2">
            <Main2 />
          </Route>

          {/*<Route path="/challenge">
            <ChallengeContent />
          </Route>

          <Route path="/join">
            <Join />
          </Route>

          <Route path="/player-picks">
            <PlayerPicks />
          </Route>

          <Route path="/player-profile">
            <PlayerProfile />
          </Route>

          <Route path="/resume-buy-picks">
            <ResumeBuyPick />
          </Route>

          <Route path="/start-playing">
            <StartPlaying />
          </Route>

          <Route path="/bought-picks">
            <BoughtPicks />
          </Route>
		  
		   <Route path="/profile-edit">
            <ProfileEdit />
          </Route>
		  
		   <Route path="/followers">
            <Followers />
          </Route>

          <Route path="/profile">
            <Profile />
          </Route>

          <Route path="/lobby">
            <LobbyScreen />
          </Route>

          <Route path="/challenge-friend">
            <ChallengeFriend />
          </Route>
          
          <Route path="/start-game">
            <StartGame />
          </Route>

          <Route path="/wallet">
            <Wallet />
          </Route>

          <Route path="/debug" exact>
            <Debug />
          </Route>
		  
		   <Route path="/subscription" exact>
            <Subscription />
          </Route>
		  
		   <Route path="/terms" exact>
            <Terms />
          </Route>
          
          <Route path="/today" exact>
            <Today />
          </Route>

          <Route path="/lockerroom" exact>
            <Lockerroom />
          </Route>

          <Route path="/trophyroom" exact>
            <Trophyroom />
          </Route>

          <Route path="/history" exact>
            <History />
          </Route>
		*/}

        </Switch>

    
    </Router>
  );
}

export default App;
