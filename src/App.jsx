import React, { useContext, useEffect } from "react";
import "./app.css";
import Routering from "./Router";
import { DataContext } from "./DataProvider/DataProvider";
import { auth } from "./Utility/firebase";
import { Type } from "./Utility/actionType";

function App() {
  const [{user},dispatch]=useContext(DataContext)
  useEffect(()=>auth.onAuthStateChanged((authUser)=>{
    if(authUser){
      dispatch({type:Type.SET_USER,user:authUser})
    }else{
      dispatch({type:Type.SET_USER,user:null})
    }
  }),[])
  return (
    <>
      <Routering />
    </>
  );
}

export default App;
