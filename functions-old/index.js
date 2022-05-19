const functions = require("firebase-functions");
const axios=require("axios");


const admin=require("firebase-admin");
admin.initializeApp();
const db=admin.firestore();

 
/*
exports.hello_world=functions.https.onRequest((req,res)=>{
    res.send("Hello from firebase functions");
})

exports.api=functions.https.onRequest(async (req,res)=>{
    switch(req.method){
        case "GET":
            const response= await axios.get("https://jsonplaceholder.typicode.com/users/1");

            res.send(response.data);
            break;

            case "POST":
                res.send(req.body);
                break;

            case "DELETE":
                res.send("DELETE METHODE");
                break;
            
            default:
                res.send("default method");
                
        
    }
})

exports.userAdded=functions.auth.user().onCreate((user)=>{
    console.log("user created",user.email);
    return Promise.resolve();
})

exports.pick_made=functions.firestore.document("/psg_picks/{documentId}").onCreate(async (snap,context)=>{
    //console.log("pick made ",snap.id);
    //console.log("picks made data",snap.data());
    await db.collection("picks_mdate").add({key:snap.id,...snap.data()});
    return Promise.resolve();
})


exports.test=functions.https.onRequest((req,res)=>{
    res.send("hello world from test");
})*/