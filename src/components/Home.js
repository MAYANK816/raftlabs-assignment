import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../Firebase/Firebase';
import MainComponent from './MainComponent';
import {
  getDocs,
  collection,
} from "firebase/firestore";
import '../App.css'

const Home = () => {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const [info, setInfo] = useState({});
  const [following, setFollowing] = useState([]);
  useEffect(() => {
    if (loading) {
     return ;
    }
    else if (!user) {
      navigate('/');
    }
    else if (error) {
      alert(error);
    }
    else{
      fetchData();
    }
  
  }, [user, loading, error]);

  const fetchData = async () => {
    try {
      const followingData = await getFollowing();
      // Do something with the following data
      setFollowing(followingData);
      fetchPosts(followingData);

    } catch (error) {
      console.error("Error fetching following:", error);
      // Handle the error
    }
  };

  const getFollowing = async () => {
    if (user) {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        let following = [];
        querySnapshot.forEach((doc) => {
          if (doc.data().uid === user.uid) {
            following = doc.data().following;
          }
        });
        return following; // Return the following data
      } catch (error) {
        throw new Error("Error fetching following: " + error);
      }
    } else {
      throw new Error("User not found");
    }
  };
  
  const fetchPosts = async (following2) => {
    if (user) {
      let postData = new Map(); 
      for ( let id of following2){
        const querySnapshot = await getDocs(collection(db, "Posts","allPosts",id));
        querySnapshot.forEach((doc) => {
          let data = doc.data();
          postData.set(doc.id, {data:data,postId:id});
        });
      }
      setInfo(postData);
    }
    else{
      console.log("no");
    }
  };

  return <> 
  {loading?"Loading....":user && following.length>0?
    <MainComponent info={info}/>
    :"You Have 0 Following"}
    </>
}

export default Home;
