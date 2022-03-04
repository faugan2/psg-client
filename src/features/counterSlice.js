import {createSlice } from '@reduxjs/toolkit';


const initialState = {
  value: 0,
  page:0,
  pageName:"",
  screenHeight:0,
  headerHeight:0,
  singlePageName:"",
  activeTab:0,
  headerTab:0,
  tournaments:[],
  sports:[],
  leagues:[],
  today:"",
  selectedTournament:{},
  selectedGames:[],
  selectedPicks:[],
  users:[],
  selectedPlayer:{},
  profileTab:0,
  myPicks:[],
  picks:[],
  gamesPicked:[],
  cart:[],
  picksBought:[],
  myPicksBouth:[],
  startPlaying:0,
  follow:[],
  tab:0,
  registration:0,
  games_drawer:{
    sport:0,
    league:0,
    mode:0,
    type:0,
    real:false,
    entry:0
  },
  friendChallenge:[],
  activeSearch:false,
  searchFriendtext:"",
  multipleFriend:false,
  todayTime:0,
  invitedFriends:[],
  games:[],
  defaultValues:[],
  usersStats:[],
  transactions:[],
  friends:[],
  challenge_date:"",
  challenge_dates:[],
  nextGamesDates:[],
  mainChallenges:[],
  timeZone:"",


  registerInfo:null,
  sport:null,
  league:null,
  line:null,
  join:null,
  gameDate:new Date(),
  sendingPicks:false,
  viewChallenge:null,
  leaguePageOptions:null,
  createChallengeOptions:null,
  leaguePageResult:0,
  joinSuccess:false,
  myInvites:null,
  userProfile:null,
  notEnoughCoins:false,
  chat:null,
  chatUnread:0,
  chatTotal:0,
  chatRead:0,

  
};

export const appSlice = createSlice({
  name: 'counter',
  initialState,
  
  reducers: {
   
    setPage:(state,action)=>{
      state.page=action.payload;
    },
    setPageName:(state,action)=>{
      state.pageName=action.payload;
    },
    setActiveTab:(state,action)=>{
      state.activeTab=action.payload;
    },
    setTournaments:(state,action)=>{
      state.tournaments=action.payload;
    },
    setSports:(state,action)=>{
      state.sports=action.payload;
    },
    setLeagues:(state,action)=>{
      state.leagues=action.payload;
    },
    setToday:(state,action)=>{
      state.today=action.payload;
    },
    setSelectedTournament:(state,action)=>{
      state.selectedTournament=action.payload;
    },
    setSinglePageName:(state,action)=>{
      state.singlePageName=action.payload;
    },
    setSelectedGames:(state,action)=>{
      state.selectedGames=action.payload;
    },
    setSelectedPicks:(state,action)=>{
      state.selectedPicks=action.payload;
    },
    setUsers:(state,action)=>{
      state.users=action.payload;
    },
    setSelectedPlayer:(state,action)=>{
      state.selectedPlayer=action.payload;
    },
    setProfileTab:(state,action)=>{
      state.profileTab=action.payload;
    },
    setMyPicks:(state,action)=>{
      state.myPicks=action.payload;
    },
    setGamesPicked:(state,action)=>{
      state.gamesPicked=action.payload;
    },
    setPicks:(state,action)=>{
      state.picks=action.payload;
    },
    setCart:(state,action)=>{
      state.cart=action.payload;
    },
    setPicksBought:(state,action)=>{
      state.picksBought=action.payload;
    },
    setStartPlaying:(state,action)=>{
      state.startPlaying=action.payload;
    },
	
	setMyPicksBought:(state,action)=>{
		state.myPicksBouth=action.payload;
	},
	setFollow:(state,action)=>{
		state.follow=action.payload;
	},

  setHeaderTab:(state,action)=>{
    state.headerTab=action.payload;
  },

  setTab:(state,action)=>{
    state.tab=action.payload;
  },
  setScreenHeight:(state,action)=>{
    state.screenHeight=action.payload;
  },
  setHeaderHeight:(state,action)=>{
    state.headerHeight=action.payload;
  },
  setRegistration:(state,action)=>{
    state.registration=action.payload;
  },

  set_games_Drawer:(state,action)=>{
    state.games_drawer=action.payload;
  },

  setFriendChallenged:(state,action)=>{
    state.friendChallenge=action.payload;
  },

  setActiveSearch:(state,action)=>{
    state.activeSearch=action.payload;
  },
  setSearchFriendtext:(state,action)=>{
    state.searchFriendtext=action.payload;
  },
  setMultipleFriend:(state,action)=>{
    state.multipleFriend=action.payload;
  },
  setTodayTime:(state,action)=>{
    state.todayTime=action.payload;
  },
  setInvitedFriends:(state,action)=>{
    state.invitedFriends=action.payload;
  },
  setGames:(state,action)=>{
    state.games=action.payload;
  },
  setDefaultValues:(state,action)=>{
    state.defaultValues=action.payload;
  },
  setUsersStats:(state,action)=>{
    state.usersStats=action.payload;
  },
  setTransactions:(state,action)=>{
    state.transactions=action.payload;
  },

  setFriends:(state,action)=>{
    state.friends=action.payload;
  },

  setChallenge_date:(state,action)=>{
    state.challenge_date=action.payload;
  },
  
  setChallenge_dates:(state,action)=>{
    state.challenge_dates=action.payload;
  },
  setNextGamesDates:(state,action)=>{
    state.nextGamesDates=action.payload;
  },
  setMainChallenges:(state,action)=>{
    state.mainChallenges=action.payload;
  },

  setTimeZone:(state,action)=>{
    state.timeZone=action.payload;
  },

  setRegisterInfo:(state,action)=>{
    state.registerInfo=action.payload;
  },

  setSport:(state,action)=>{
    state.sport=action.payload;
  },

  setLine:(state,action)=>{
    state.line=action.payload;
  },
  setGameDate:(state,action)=>{
    state.gameDate=action.payload;
  },
  setJoin:(state,action)=>{
    state.join=action.payload;
  },
  setSendingPicks:(state,action)=>{
    state.sendingPicks=action.payload;
  },

  setViewChallenge:(state,action)=>{
    state.viewChallenge=action.payload;
  },

  setLeague:(state,action)=>{
    state.league=action.payload;
  },
  setLeaguePageOptions:(state,action)=>{
    state.leaguePageOptions=action.payload;
  },
  setCreateChallengeOptions:(state,action)=>{
    state.createChallengeOptions=action.payload;
  },
  setLeaguePageResult:(state,action)=>{
    state.leaguePageResult=action.payload;
  },
  setJoinSuccess:(state,action)=>{
    state.joinSuccess=action.payload;
  },

  setMyInvites:(state,action)=>{
    state.myInvites=action.payload;
  },
  setUserProfile:(state,action)=>{
    state.userProfile=action.payload;
  },
  setNotEnoughCoins:(state,action)=>{
    state.notEnoughCoins=action.payload;
  },
  setChat:(state,action)=>{
    state.chat=action.payload;
  },
  setChatUnread:(state,action)=>{
    state.chatUnread=action.payload;
  },
  setChatTotal:(state,action)=>{
    state.chatTotal=action.payload;
  },
  setChatRead:(state,action)=>{
    state.chatRead=action.payload;
  },



  }});

export const {
  setPage,
  setPageName,
  setActiveTab,
  setTournaments,
  setSports,
  setLeagues,
  setToday,
  setSelectedTournament,
  setSinglePageName,
  setSelectedGames,
  setSelectedPicks,
  setUsers,
  setSelectedPlayer,
  setProfileTab,
  setMyPicks,
  setPicks,
  setCart,
  setPicksBought,
  setStartPlaying,
  setMyPicksBought,
  setFollow,
  setHeaderTab,
  setTab,
  setScreenHeight,
  setHeaderHeight,
  setRegistration,
  set_games_Drawer,
  setFriendChallenged,
  setActiveSearch,
  setSearchFriendtext,
  setMultipleFriend,
  setTodayTime,
  setInvitedFriends,
  setGames,
  setDefaultValues,
  setUsersStats,
  setTransactions,
  setFriends,
  setChallenge_date,
  setChallenge_dates,
  setNextGamesDates,
  setMainChallenges,
  setTimeZone,
  setRegisterInfo,
  setSport,
  setLine,
  setGameDate,
  setJoin,
  setSendingPicks,
  setViewChallenge,
  setLeague,
  setLeaguePageOptions,
  setCreateChallengeOptions,
  setLeaguePageResult,
  setJoinSuccess,
  setMyInvites,
  setUserProfile,
  setNotEnoughCoins,
  setChat,
  setChatUnread,
  setChatTotal,
  setChatRead,
} = appSlice.actions;

export const selectPage  = (state) => state.counter.page;
export const selectPageName=(state)=>state.counter.pageName;
export const selectActiveTab=(state)=> state.counter.activeTab;
export const selectTournaments=(state)=> state.counter.tournaments;
export const selectSports=(state)=> state.counter.sports;
export const selectLeagues=(state)=>state.counter.leagues;
export const selectToday=(state)=>state.counter.today;
export const selectSelectedTournament=(state)=>state.counter.selectedTournament;
export const selectSinglePageName=(state)=> state.counter.singlePageName;
export const selectSelectedGames=(state)=> state.counter.selectedGames;
export const selectSelectedPicks=(state)=> state.counter.selectedPicks;
export const selectUsers=(state)=> state.counter.users;
export const selectSelectedPlayer=(state)=> state.counter.selectedPlayer;
export const selectProfiletab=(state)=> state.counter.profileTab;
export const selectMyPicks=(state)=> state.counter.myPicks;
export const selectPicks=(state)=> state.counter.picks;
export const selectCart=(state)=> state.counter.cart;
export const selectPicksBought=(state)=> state.counter.picksBought;
export const selectStartPlaying=(state)=> state.counter.startPlaying;
export const selectMyPicksBought=(state)=>state.counter.myPicksBouth;
export const selectFollow=(state)=>state.counter.follow;
export const selectHeaderTab=(state)=> state.counter.headerTab;
export const selectTab=(state)=> state.counter.tab;
export const selectScreenHeight=(state)=> state.counter.screenHeight;
export const selectHeaderHeight=(state)=> state.counter.headerHeight;
export const selectRegistration=(state)=> state.counter.registration;
export const selectGames_drawer=(state)=> state.counter.games_drawer;
export const selectFriendChallenged=(state)=> state.counter.friendChallenge;
export const selectActiveSearch=(state)=> state.counter.activeSearch;
export const selectSearchFriendText=(state)=> state.counter.searchFriendtext;
export const selectMultipleFriend=(state)=> state.counter.multipleFriend;
export const selectTodayTime=(state)=> state.counter.todayTime;
export const selectInvitedFriend=(state)=> state.counter.invitedFriends;
export const selectGames=(state)=> state.counter.games;
export const selectDefaultValues=(state)=> state.counter.defaultValues;
export const selectUsersStats=(state)=> state.counter.usersStats;
export const selectTransactions=(state)=> state.counter.transactions;
export const selectFriends=(state)=> state.counter.friends;
export const selectChallengeDate=(state)=> state.counter.challenge_date;
export const selectChallengeDates=(state)=> state.counter.challenge_dates;
export const selectNextGamesDates=(state)=> state.counter.nextGamesDates;
export const selectMainChallenges=(state)=> state.counter.mainChallenges;
export const selectTimeZone=(state)=> state.counter.timeZone;
export const selectRegisterInfo=(state)=> state.counter.registerInfo;
export const selectSport=(state)=> state.counter.sport;
export const selectLine=(state)=> state.counter.line;
export const selectGameDate=(state)=> state.counter.gameDate;
export const selectJoin=(state)=> state.counter.join;
export const selectSendingPicks=(state)=> state.counter.sendingPicks;
export const selectViewChallenge=(state)=> state.counter.viewChallenge;
export const selectLeague=(state)=>state.counter.league;
export const selectLeaguePageOptions=(state)=>state.counter.leaguePageOptions;
export const selectCreateChallengeOptions=(state)=>state.counter.createChallengeOptions;
export const selectLeaguePageResult=(state)=>state.counter.leaguePageResult;
export const selectJoinSuccess=(state)=>state.counter.joinSuccess;
export const selectMyInvites=(state)=>state.counter.myInvites;
export const selectUserProfile=(state)=>state.counter.userProfile;
export const selectNotEnoughCoins=(state)=>state.counter.notEnoughCoins;
export const selectChat=(state)=>state.counter.chat;
export const selectChatUnread=(state)=> state.counter.chatUnread;
export const selectChatTotal=(state)=> state.counter.chatTotal;
export const selectChatRead=(state)=> state.counter.chatRead;

export default appSlice.reducer;
